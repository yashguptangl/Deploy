"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import SortFilter from "../../components/filterSort";
import { useSearchParams, useRouter } from "next/navigation";
import ListingData from "../../types/listing";
import axios from 'axios';


interface WishlistProps {
    userId: string;
    listingId: string;
    type: "flat" | "pg" | "room";
}


export default function Listing() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const lookingFor = searchParams.get("look") || "";
    const city = searchParams.get("city") || "";
    const townSector = searchParams.get("townSector") || "";
    const [listingData, setListingData] = useState<ListingData[]>([]);
    console.log("listingData", listingData);
    const [saved, setSaved] = useState(false);


    useEffect(() => {
        async function fetchData() {
            const data = await fetch(`http://localhost:3000/api/v1/listing/search/?looking_for=${lookingFor}&city=${city}&townSector=${townSector}`);
            setListingData(await data.json());
        }
        fetchData();
        console.log("listingData", listingData);
    }, [])

    const handleListingClick = (listing: ListingData) => {
        // Store the listing data in sessionStorage
        sessionStorage.setItem("selectedListing", JSON.stringify(listing));

        // Navigate to the listing detail page
        router.push(`/flat/${listing.id}`);
    };
    const token = localStorage.getItem("token");
    let userId = "";

    let tokenPayload: any = null;
    if (token) {
        try {
            const payloadBase64 = token.split(".")[1]; // Extract payload part
            tokenPayload = JSON.parse(atob(payloadBase64 || "")); // Decode Base64
            userId = tokenPayload.id;
        } catch (error) {
            console.error("Error parsing token:", error);
        }
    }

    const handleWishlist = async ({ userId, listingId, type }: WishlistProps) => {
        try {
            if (!saved) {
                await axios.post("http://localhost:3000/api/v1/user/wishlist", {
                    userId: userId,
                    listingId: listingId,
                    type: "flat"
                }, {
                    headers: {
                        'token': token,
                        "Content-Type": "application/json",
                    }
                });
                setSaved(true);
            } else {
                await axios.delete(`http://localhost:3000/api/v1/user/wishlist/${listingId}`, {
                    headers: {
                        'token': token,
                        "Content-Type": "application/json",
                    }
                });
                setSaved(false);
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };

    return (
        <>

            <Navbar />
            <SortFilter />
            {listingData?.listings?.map((listing: any) => (

                <div
                    key={listing.id}
                    onClick={() => handleListingClick(listing)}
                    className="w-full p-4 border rounded border-gray-300 flex gap-8 ssm:flex-col ssm:gap-0.5 mb-1.5 bg-gray-100 mt-1 ml:flex-row ml:gap-6 mod:flex-col ">
                    {/* Image Gallery */}
                    <div className="relative flex ssm:flex-row ssm:gap-3 ml:flex-col">
                        <div className="relative h-64 ssm:h-44">
                            <img
                                src={listing.images[0]}
                                alt="Main View"
                                className="h-full w-full object-cover rounded"
                            />
                            <button
                                // onClick={handlePreviousImage}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100"
                            >
                                &lt;
                            </button>
                            <button
                                // onClick={handleNextImage}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-70 hover:opacity-100"
                            >
                                &gt;
                            </button>

                        </div>
                        <div className="flex gap-1 justify-center ssm:flex-col ssm:gap-1.5 ml:flex-row">
                            {listing.images.map((img: string, index: number) => (
                                <img
                                    key={index + 1}
                                    src={img}
                                    alt={`Thumbnail ${index}`}
                                    className={`h-14 w-18 cursor-pointer rounded ssm:h-10 ssm:w-14 ml:h-12 ${index ? "border-2 border-black" : ""}`}
                                // onClick={() => handleThumbnailClick(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="ssm:mt-0.5">

                        <p className="text-3xl  text-black font-medium ssm:text-base md:text-3xl">
                            {listing.location} {listing.city} {listing.townSector}
                        </p>
                        <p className="text-xl  text-gray-600 font-medium ssm:text-base">{listing.BHK} BHK Flat
                            <span className="text-lg font-medium text-blue-300 ssm:text-sm ml-2">Security {listing.security}{" "}</span>
                            <span className="text-pink-600 ml-2 text-lg font-medium ssm:text-xs">
                                Maintenance {listing.maintenance}
                            </span>
                        </p>
                        <div >
                            <p className="text-2xl text-green-600 font-bold ssm:text-lg text-center">
                                Rent: &nbsp; {listing.MinPrice} - {listing.MaxPrice}
                            </p>
                            <p className="text-lg font-medium text-gray-600 ml-24 ssm:text-sm ssm:ml-32 mod:ml-40">
                                MIN &nbsp; &nbsp; &nbsp; &nbsp; MAX
                            </p>
                            <span className="text-lg ssm:text-xs text-gray-700 ml:text-xs ml:ml-16 lg:text-sm lg:ml-28 ssm:text-center">All Flat Price Different</span>
                        </div>


                        {/* Tags */}
                        <div className="flex gap-8 flex-wrap ssm:gap-3">
                            <span className="font-semibold text-base text-blue-600 ssm:text-xs">
                                {Array.isArray(listing.preferTenants) ? (
                                    listing.preferTenants.map((tenant: any, index: any) => (
                                        <span key={index} className="font-semibold text-base text-blue-600 ssm:text-xs">
                                            {tenant}
                                        </span>
                                    ))
                                ) : (
                                    <span className="font-semibold text-base text-blue-600 ssm:text-xs">
                                        {listing.preferTenants}
                                    </span>
                                )}
                            </span>
                            <span className="font-semibold text-base text-gray-600 ssm:text-xs ">
                                {listing.flatType}
                            </span>
                            <span className="font-semibold text-base text-pink-400 ssm:text-xs ">
                                {listing.furnishingType}
                            </span>
                        </div>

                        {/* Contact */}
                        <div className="flex items-center gap-20 mt-2 ssm:gap-6">
                            {/* <img
               src={Banglore.src}
               alt="Banglore"
               className="h-6 w-32 object-cover ssm:h-4 ssm:w-24"
             /> */}
                            <button className="bg-orange-800 text-white rounded px-4 py-2 text-sm font-semibold ssm:text-xs ssm:px-2 ssm:py-1">
                                CONTACT OWNER
                            </button>
                            <button
                                className={`px-3 py-1 rounded ${saved ? "bg-red-500 text-white" : "bg-gray-200 text-black"}`}
                                onClick={() => handleWishlist({ userId, listingId: listing.id, type: "flat" })}
                            >
                                {saved ? "Remove from Wishlist" : "Save to Wishlist"}
                            </button>
                        </div>
                    </div>
                </div>

            ))}
        </>
    );
}
