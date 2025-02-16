"use client";
import { useState, useEffect } from "react";
import Bedroom from "../../../assets/bedroom.jpg";
import Customer from "../../../assets/customer.png";
import Delete from "../../../assets/delete.png";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { LeadLog } from "../../../types/lead";
import { ListingItem } from "../../../types/listing";

type Tab = "guide" | "myRental" | "usedLead";
import { LeadLog } from "../../../types/lead";
import Image from "next/image";
import { ListingItem } from "../../../types/listing";


export default function Dashboard(prop: any) {
  const [activeTab, setActiveTab] = useState<Tab>("myRental"); // Default active tab
  const [showModal, setShowModal] = useState(false); // Show/Hide modal
  const [leads, setLeads] = useState(10); // Default number of leads
  const [price, setPrice] = useState(leads * 5); // Calculate price based on leads
  const [isRentalListOpen, setIsRentalListOpen] = useState(false);
  const [listings, setListings] = useState<ListingItem[]>([]); // Ensure listings is always an array
  const [points, setPoints] = useState("");
  const [usedLeads, setUsedLeads] = useState<any[]>([]);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the payload
      const payloadBase64 = token.split(".")[1]; // Extract payload part
      const payload = payloadBase64 ? JSON.parse(atob(payloadBase64)) : null; // Decode Base64
      console.log("Payload:", payload);

      // Fetch listings using the id from payload
      fetchListings(token, payload.owner.id);
      usedLeadData(token, payload.owner.id);
    }
  }, []);



  const usedLeadData = async (token: string, ownerId: string) => {
    try {
      const leadResponse = await axios.get(`http://localhost:3000/api/v1/owner/contact-logs/${ownerId}`,
        { headers: { token } }
      )
      setUsedLeads(leadResponse.data);
      console.log("Used Leads:", leadResponse.data);
    } catch (err) {
      console.error("Error fetching used leads:", err);
    }
  };

  const fetchListings = async (token: string, ownerId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/owner/${ownerId}/listings`,
        { headers: { token } }
      );

      const { points, FlatInfo, PgInfo, RoomInfo } = response.data;
      setPoints(points);

      const combinedListings = [
        ...(await mapListing(FlatInfo, "flat", token)),
        ...(await mapListing(PgInfo, "pg", token)),
        ...(await mapListing(RoomInfo, "room", token)),
      ];

      setListings(combinedListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      alert("Failed to load listings. Please try again.");
    }
  };

  const mapListing = async (data: any[], type: string, token: string): Promise<any[]> => {
    return Promise.all(data.map(async item => {
      const insideImageUrl = await fetchInsideImage(type, item.id, token);
      console.log(`Fetched image URL for ${type}-${item.id}: ${insideImageUrl}`);
      return {
        id: `${type}-${item.id}`,
        uniq: item.id,
        type,
        imageUrl: insideImageUrl || item.imageUrl || Bedroom.src,
        location: item.location,
        townSector: item.townSector,
        city: item.city,
        Bhk: item.BHK,
        security: item.security,
        minprice: item.MinPrice,
        maxprice: item.MaxPrice,
        isVisible: item.isVisible,
        isVerified: item.isVerified,
      };
    }));
  };

  const fetchInsideImage = async (type: string, uniq: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/owner/images/${type}/${uniq},`,
        {
          headers: {
            token: token,
          },
        }
      );

      const fullImageUrl = response.data.images; // Full image URL
      return fullImageUrl; // Return the full image URL
    } catch (e) {
      console.error("Error fetching inside image:", e);
      return Bedroom.src; // Return fallback image URL
    }
  };

  const toggleButton = (listingId: string) => {
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === listingId ? { ...listing, isVisible: !listing.isVisible } : listing
      )
    );
  };




  const handleLeadChange = (e: any) => {
    const value = Math.max(10, e.target.value); // Minimum value is 10
    setLeads(value);
    setPrice(value * 5); // Update price
  };

  const handlePay = () => {
    setShowModal(false);
    alert(`You have successfully purchased ${leads} leads for ₹${price}`);
    // Integrate payment gateway logic here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex flex-row items-center justify-around bg-white p-3">
        <div className="flex flex-col gap-0.5 items-center mt-0.5">
          <p className="text-lg">Lead Left: {points}</p>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 bg-green-600 rounded-md ssm:p-1 ssm:text-xs md:p-2 md:text-sm"
          >
            Buy Lead
          </button>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md w-9/12 sm:w-2/3 md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4 text-center">Buy Leads</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2">
                Enter Number of Leads (Min 10):
              </label>
              <input
                type="number"
                value={leads}
                onChange={handleLeadChange}
                className="w-full border border-gray-300 rounded-md p-2"
                min={10}
              />
            </div>
            <div className="text-lg font-semibold text-center mb-4">
              Total Price: ₹{price}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Navigation Tabs */}
      <div className="flex justify-between border-b border-gray-300 bg-blue-400">
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex-1 text-center py-2 font-semibold ${activeTab === "guide"
              ? "text-blue-500 border-b-3 border-blue-500"
              : "text-white"
            }`}
        >
          Guide
        </button>
        <button
          onClick={() => setActiveTab("myRental")}
          className={`flex-1 text-center py-2 font-semibold ${activeTab === "myRental"
              ? "text-blue-500 border-b-3 border-blue-500"
              : "text-white"
            }`}
        >
          My Rentals
        </button>
        <button
          onClick={() => setActiveTab("usedLead")}
          className={`flex-1 text-center py-2 font-semibold ${activeTab === "usedLead"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-white"
            }`}
        >
          Used Lead
        </button>
      </div>
      {/* Tab Content */}
      <div className="flex items-center justify-center ">
        {activeTab === "myRental" && (
          <div className="w-full flex items-center justify-between flex-col">
            <div className="flex justify-between p-4 ssm:p-1 w-72">
              <h2
                className="text-base font-medium mb-4 cursor-pointer ssm:text-sm"
                onClick={() => setIsRentalListOpen(!isRentalListOpen)}
              >
                Add Rental +
              </h2>
            </div>

            {/* Rental Card */}
            {listings.length === 0 ? (
              <p>No Listings Available</p>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white flex flex-col w-72 rounded-md shadow-md overflow-hidden mb-4"
                >
                  <div>
                    {listing.isVisible ? (
                      <Image
                        src={listing.imageUrl}
                        fill
                        alt="Room"
                        className=" object-cover p-2  rounded-xl "
                        onError={(e) => {
                          e.currentTarget.src = Bedroom.src; // Fallback image
                        }}
                      />
                    ) : (
                      <Image
                        src={listing.imageUrl}
                        alt="Room"
                        fill
                        className="w-full sm:w-44 h-40 object-cover p-2 md:h-40 md:w-72 rounded-xl mod:w-72 mod:h-36 ssm:h-36 ssm:w-72 opacity-50"
                        onError={(e) => {
                          e.currentTarget.src = Bedroom.src; // Fallback image
                        }}
                      />
                    )}
                  </div>
                  <div className="flex justify-center items-center gap-2 p-2">
                    <label htmlFor={`publish-${listing.id}`} className="text-sm">
                      Publish
                    </label>
                    <button
                      onClick={() => toggleButton(listing.id)}
                      id={`publish-${listing.id}`}
                      className={`px-1 py-0.5 rounded-lg text-white text-xs w-8 ${
                        listing.isVisible ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {listing.isVisible ? "on" : "off"}
                    </button>
                  </div>

                  <div className="p-2">
                    <p className="ssm:text-base md:text-base ">
                      {listing.location}, {listing.townSector}, {listing.city}
                    </p>
                    <h2 className="text-xl font-medium ssm:text-xs mod:text-base">
                      {listing.BHK} BHK {listing.type} | Security {listing.security}{" "}
                    </h2>
                    <p className="text-green-600 font-medium text-sm">
                      Rent : {listing.MinPrice} - {listing.MaxPrice}
                    </p>
                    <p className="text-sm ">
                      {listing.isVisible ? "Listing is show in web" : "Listing is off"}
                    </p>

                    <button
                      className={`mt-1.5 rounded-md text-white text-sm ssm:text-sm ssm:p-2 w-full ${
                        listing.isVerified ? "bg-blue-600" : "bg-red-600"
                      }`}
                    >
                      {listing.isVerified ? "Verified" : "Pending Verification"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "usedLead" && (
          <div className="mt-4 w-full sm:w-2/3 mx-auto">
            <h2 className="text-base font-medium mb-4 text-center">
              Customer Visited Your Profile
            </h2>

            {/* Contact Log */}
            {usedLeads.logs.length === 0 ? (
              <p className="text-center">No leads available</p>
            ) : (
              usedLeads.logs.map((lead: LeadLog) => (
                <div key={lead.id} className="bg-white rounded-md shadow-md p-4 mb-4">
                  <p className="p-2 text-base flex items-center justify-center ">
                    Address: {lead.adress}
                  </p>
                  <div className="flex items-center justify-center gap-8 p-2 border-b border-gray-300 ">
                    <div className="flex items-center space-x-2">
                      <img
                        src={Customer.src}
                        alt={lead.customerName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{lead.customerName}</span>
                        <span className="text-xs">Mob No.: {lead.customerPhone}</span>
                        <span className="text-xs">Date: {new Date(lead.accessDate).toLocaleDateString('en-CA')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Call
                      </button>

                      <Image
                        src={Delete.src}
                        alt="Delete"
                        className="cursor-pointer"
                        height={30}
                        width={30}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rental List Modal */}
        {isRentalListOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-md w-9/12 sm:w-2/3 md:w-1/3 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-4 text-center">Add Rental</h2>

              {/* Links to Rentals */}
              <div className="space-y-4 text-center flex flex-col">
                <Link className="text-blue-500 hover:underline" href="/owner/flat">
                  FLAT
                </Link>
                <Link className="text-blue-500 hover:underline" href="/owner/room">
                  ROOM
                </Link>
                <Link className="text-blue-500 hover:underline" href="/owner/pg">
                  PG
                </Link>
              </div>

              {/* Close Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsRentalListOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "guide" && (
          <div className="mt-4 w-full sm:w-2/3 mx-auto flex justify-center items-center flex-col bg-gray-200 ">
            <div className="pb-8">
              <ul>
                <li className="text-base list-disc text-red-600">
                  Profile automatically off when lead is off
                </li>
                <li className="text-base list-disc text-red-600">
                  Profile automatically off when lead is off
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}