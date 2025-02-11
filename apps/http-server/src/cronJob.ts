import cron from "node-cron";
import { prisma } from "@repo/db/prisma";

// ⏳ **Har Ek Ghante (Every Hour) Expired Logs Delete Karega**
cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();

        // ❌ **Expired Contact Logs Delete Karo**
        const deletedLogs = await prisma.contactLog.deleteMany({
            where: { expiryDate: { lte: now } },
        });

        console.log(`🗑 Deleted ${deletedLogs.count} expired contact logs.`);
    } catch (error) {
        console.error("❌ Error deleting expired logs:", error);
    }
});

console.log("⏳ Cron job started: Checking for expired contact logs every hour...");
