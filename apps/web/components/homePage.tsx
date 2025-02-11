"use client";
import banglore from "../assets/Banglore.jpg";
import dehradun from "../assets/dehradun.jpg";
import delhi from "../assets/delhi.jpg";
import gaziabad from "../assets/gaziabad.jpg";
import hydrabad from "../assets/Hydrabad.jpg";
import gurugram from "../assets/Gurugram.jpg";
import mumbai from "../assets/Mumbai.jpg";
import noida from "../assets/Noida.jpg";
import ComboBox from "./searchBox";
import { citiesData } from "../data/cities";
import { useState } from "react";
import rent from "../assets/ad-rent.png";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "./navbar";
import MainFooter from "./mainfooter";

export default function Home() {
  const [lookingFor, setLookingFor] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [listings, setListings] = useState([]);
  const router = useRouter();

  const handleTownChange = (town: string) => {
    setSelectedTown(town);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedTown(""); // Reset town/sector when city changes
  };

  const handleSearch = async () => {
    if (!lookingFor || !selectedCity || !selectedTown) {
      alert("Please select all fields before searching.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/listing/search?looking_for=${lookingFor}&city=${selectedCity}&townSector=${selectedTown}`
      );

      if (response.status === 200) {
        const { listings } = response.data;
        setListings(listings);
        router.push("/listing");
      } else {
        alert("No Listing Found");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex overflow-x-auto scrollbar-hide gap-2.5 ml-1 mt-4 px-4 snap-x snap-mandatory">
        {[banglore, dehradun, delhi, gaziabad, hydrabad, gurugram, mumbai, noida].map((image, index) => (
          <img
            key={index}
            className="h-25 w-[calc(100%/3)] mod:w-[calc(100%/3)] md:w-[calc(100%/6)] lg:w-[calc(100%/9)] flex-shrink-0 object-cover snap-start"
            src={image.src}
            alt={`City ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center mt-14 space-y-4 text-black-300 px-4">
        <p className="bg-gray-500 px-3 py-1 rounded text-left relative font-medium ssm:mr-[11.5rem] mod:mr-[15.5rem] ml:mr-[18.5rem] sm:mr-[18rem] top-4">
          For Rent
        </p>
        <div className="flex items-center border border-gray-300 rounded-lg p-3 max-w-[18rem] ssm:min-w-[19.5rem] mod:min-w-[22.2rem] sm:min-w-[24rem] ml:min-w-[24rem] md:min-w-[24rem]">
          <select
            className="flex-grow bg-transparent text-gray-600 outline-none"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
          >
            <option value="" disabled selected>
              Looking for
            </option>
            <option value="pg">PG</option>
            <option value="room">Room</option>
            <option value="flat">Flat</option>
            <option value="officespace">Office Space</option>
          </select>
        </div>

        <ComboBox
          options={Object.keys(citiesData)}
          placeholder="City"
          onChange={handleCityChange}
        />

        <ComboBox
          options={selectedCity ? citiesData[selectedCity] || [] : []}
          placeholder="Town & Sector"
          onChange={handleTownChange}
        />
        <button
          className="w-full sm:w-96 bg-blue-300 text-white p-1 text-lg sm:text-xl rounded-lg"
          onClick={handleSearch}
        >
          Let's Search ...
        </button>
        <img
          src={rent.src}
          alt="sec"
          onClick={() => router.push("/owner/signin")}
          className="h-6 ml-28 ssm:ml-32 mod:ml-44 ml:ml-56 "
        />
        <div className="text-end mt-4">
          <p className="text-blue-300 text-lg ml-20 ssm:ml-6 mod:ml-20 sm:ml-28 ml:ml-32 sm:text-lg md:text-xl font-semibold">
            India's Largest Room Collection
          </p>
          <p className="font-semibold text-lg sm:text-end md:text-lg ">
            Trust on Verified Rooms
          </p>
        </div>
      </div>
      <MainFooter />
    </>
  );
}
