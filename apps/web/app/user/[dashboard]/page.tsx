"use client";
import Bedroom from "../../../assets/bedroom.jpg";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

interface WishlistItem {
  id: string;
  location: string;
  townSector: string;
  city: string;
  Bhk: string;
  security: string;
  type: string;
  minprice: number;
  maxprice: number;
  imageUrl: string;
}

export default function User() {

  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data: wishListData } = await axios.get(
          `http://http-server.roomlocus.com/api/v1/user/wishlist/${userId}`
        );
        setWishlist(wishListData);
      } catch (err) {
        console.log("Error fetching wishlist", err);
      }
    };
    fetchWishlist();
  }, [userId]);

  const handleViewDetails = (listingId: string, type: string) => {
    router.push(`/${type}/${listingId}`);
  };

  return (
    <>
      <div className="mb-96 flex justify-center">
        <div className="w-full sm:w-2/3">
          <h1 className="p-2 text-xl font-bold text-center">Wishlist</h1>
          {wishlist.length === 0 ? (
            <p className="text-center text-gray-600">No items in your Wishlist</p>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white flex flex-row md:flex-row items-center rounded-md shadow-md overflow-hidden cursor-pointer p-4 gap-4"
                onClick={() => handleViewDetails(item.id, item.type)}
              >
                {/* Image Section */}
                <div className="relative w-40 h-40 sm:w-44 sm:h-40 md:w-72 md:h-40">
                  <Image
                    src={item.imageUrl || Bedroom.src}
                    alt="Room"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                {/* Details Section */}
                <div className="flex flex-col">
                  <p className="text-sm md:text-lg font-semibold text-gray-700">
                    {item.location}, {item.townSector}, {item.city}
                  </p>
                  <h2 className="text-base md:text-xl font-medium text-gray-800">
                    {item.Bhk} BHK | Security {item.security}
                  </h2>
                  <p className="text-lg md:text-2xl text-green-600 font-bold">
                    Rent: ₹{item.minprice} - ₹{item.maxprice}
                  </p>

                  {/* Bottom Section */}
                  <div className="flex items-center gap-6 mt-2">
                    <div className="relative w-20 h-6 sm:w-32 sm:h-6">
                      <Image
                        src={Bedroom.src}
                        alt="Banglore"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="bg-orange-800 text-white rounded px-4 py-2 text-sm font-semibold sm:text-xs sm:px-2 sm:py-1">
                      CONTACT
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>

  );
}