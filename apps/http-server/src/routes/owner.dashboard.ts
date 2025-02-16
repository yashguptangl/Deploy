import { Router } from 'express';
import { Request, Response } from 'express';
const ownerDashboard = Router();
import { jwt, JWT_SECRET } from '../config';
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { getObjectURL } from '../utils/s3client';
import { prisma } from '@repo/db/prisma';


const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: number; username: string; mobile: string };
    } catch (error) {
        console.error("Token verification failed:", (error as Error).message); // Log the exact error
        throw new Error('Invalid or expired token');
    }
};

ownerDashboard.post("/contact-owner",authenticate , async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { propertyId, propertyType, ownerId, address  } = req.body;
        const token = req.headers.token as string;
        console.log(token);
        console.log(req.body);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token is missing' });
        }

        // Verify JWT token and extract user details
        const decoded = verifyToken(token);
        console.log(decoded);
        if (!decoded) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const { username, mobile } = decoded;

        // Fetch Owner Details
        const owner = await prisma.owner.findUnique({ where: { id: Number(ownerId) } });
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        // Create a contact log entry with 30-day validity
        await prisma.contactLog.create({
            data: {
                ownerId,
                userId: decoded.id,
                listingId : propertyId,
                customerName: username,
                customerPhone: mobile,
                adress : address,
                accessDate: new Date(),
                isExpired: false,
                propertyType,
                ownerName: owner.username,
                ownerPhone: owner.mobile,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
            },
        });

        // Reduce owner's points by 
        if (owner.points <= 0) {

            await prisma.flatInfo.updateMany({
                where: { ownerId: ownerId },
                data: { isVisible: false },
            });

            await prisma.roomInfo.updateMany({
                where: { ownerId: ownerId },
                data: { isVisible: false },
            });

            await prisma.pgInfo.updateMany({
                where: { ownerId: ownerId },
                data: { isVisible: false },
            });

        }else{
            await prisma.owner.update({
                where: { id: ownerId },
                data: {
                    points: { decrement: owner.points > 0 ? 1 : 0 },
                },
            });
        }
        

        // Return Owner’s Contact Info for User
        return res.status(200).json({
            message: 'Contact logged successfully',
            contactInfo: {
                ownerName: owner.username,
                ownerMobile: owner.mobile,
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});


ownerDashboard.get("/:id/listings", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    try {
        const ownerWithListings = await prisma.owner.findUnique({
            where: { id: Number(id) },
            include: { FlatInfo: true, RoomInfo: true, PgInfo: true }
        });
        if (!ownerWithListings) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        res.json(ownerWithListings);
    } catch (e) {
        console.log("Error in fetching listings", e);
    }
})

ownerDashboard.get("/images/:type/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { type, id } = req.params;

        if (!id || !type) {
            res.status(400).json({ message: "ID and type are required" });
            return;
        }

        // Define categories for each type
        const imageCategories: { [key: string]: string[] } = {
            pg: ["inside"],
            room: ["inside"],
            flat: ["inside"]
        };

        if (!imageCategories[type]) {
            res.status(400).json({ message: "Invalid type specified" });
            return;
        }

        // Fetch signed URLs for each category from S3
        const categories = imageCategories[type][0];
        const key = `images/${type}/${id}/${categories}.jpeg`; // Adjust the key based on your S3 folder structure
        const imageUrl = await getObjectURL(key); // Fetch presigned URL using getObjectURL

        res.json({ images: imageUrl });
        return;
    } catch (err) {
        console.error("Error fetching image URLs:", err);
        res.status(500).json({
            message: "Failed to fetch images. Please try again later.",
        });
        return;
    }
});


ownerDashboard.get("/contact-logs/:ownerId", authenticate, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { ownerId } = req.params;

        // Fetch recent contacts (valid for 30 days)
        const logs = await prisma.contactLog.findMany({
            where: {
                ownerId: Number(ownerId),
                isExpired: false,
                accessDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
            },
            orderBy: { accessDate: "desc" },
        });

        return res.status(200).json({ logs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


ownerDashboard.post("/publish", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { listingId, isVisible } = req.body;
        const { id: ownerId } = req.user;

        // Update the visibility of the listing based on the provided type
        await prisma.flatInfo.updateMany({
            where: { id: listingId, ownerId },
            data: { isVisible },
        });

        await prisma.roomInfo.updateMany({
            where: { id: listingId, ownerId },
            data: { isVisible },
        });

        await prisma.pgInfo.updateMany({
            where: { id: listingId, ownerId },
            data: { isVisible },
        });

        res.status(200).json({ message: `Listing visibility updated to ${isVisible}` });
        return;
    } catch (error) {
        console.error("Error updating listing visibility:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});

export { ownerDashboard };