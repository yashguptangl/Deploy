"use client"
import { useEffect, useState } from "react";
import ListingData from "../../../types/listing";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ListingDetail() {
    const router = useRouter();
    const [listing, setListing] = useState<ListingData | null>(null);
    const [ownerData, setOwnerData] = useState<any | null>(null);
    const [alreadyContactData, setAlreadyContactData] = useState<any | null>(null);
    
    const token = localStorage.getItem("token");

    let payload: any = null;
    if (token) {
        const payloadBase64 = token.split(".")[1]; // Extract payload part
        payload = JSON.parse(atob(payloadBase64 || "")); // Decode Base64
    }

    useEffect(() => {
      const storedListing = sessionStorage.getItem("selectedListing");
      if (storedListing) {
        setListing(JSON.parse(storedListing));
      }
      console.log(token)
      if (token) {
        contactAlreadyShow(token, payload.id);
      }
    }, []);
  
    if (!listing) {
      return <div>Loading...</div>;
    }
  
    async function contact() {
      if (!token) {
        router.push("/user/signin");
        return; // Ensure it doesn't continue if no token
      }
  
      try {
        const data = await fetch(`http://localhost:3000/api/v1/owner/contact-owner/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token, 
          },
          body: JSON.stringify({
            propertyId: listing.id,
            propertyType: listing.Type,
            ownerId: listing.ownerId,
            adress: listing.Adress,
          }),
        });
  
        const response = await data.json();
        setOwnerData(response);
        console.log(ownerData)
      } catch (error) {
        console.error(error);
      }
    }

    async function contactAlreadyShow(token :  string , userId : number) {
      try{
        const alreadyContact = await axios.get(`http://localhost:3000/api/v1/listing/contact-logs/${userId}`,{
          headers : {
            'token' : token,
            'Content-Type' : 'application/json'
          }
        })
        setAlreadyContactData(alreadyContact.data);
        console.log(token)
      }catch(err){
        console.error("Failed : ",err);

      }
    }

  return (<>
    <div className="max-w-6xl mx-auto">
    <div className="bg-white rounded-md p-4">
      <div className="flex flex-col lg:flex-row lg:gap-8 gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <img
            src={listing.images[0]}
            alt="Room"
            className="w-full rounded-md"
          />
          <div className="flex justify-center gap-2 p-4">
             <img src={listing.images[1]} className="w-1/4 rounded"/>
             <img src={listing.images[2]} className="w-1/4 rounded"/>
             <img src={listing.images[3]} className="w-1/4 rounded"/>
             <img src={listing.images[4]} className="w-1/4 rounded"/>
          </div>
         
        </div>

        {/* Right Section */}
        <div className="flex-1 ml-32">
          <h1 className="text-2xl font-semibold">
            {listing.location} {listing.city} {listing.townSector}
             
          </h1>
          <div className="flex items-center gap-4 my-2">
            <span className="text-green-600 font-bold">VERIFIED</span>
            <span className="text-red-500">Security</span>
            <span className="text-purple-500">Maintenance</span>
          </div>
          <h2 className="text-2xl font-bold text-green-600 m-10">{listing.MinPrice} - {listing.MaxPrice} Rs</h2>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <ul className="list-none list-inside text-gray-600">
              <li>&#10003; Security: {listing.security} Rs</li>
              <li>&#10003; Maintenance: {listing.maintenance} Rs</li>
              <li>&#10003; Notice Period: {listing.noticePeriod}</li>
              <li>&#10003; Furnishing Type : {listing.furnishingType}</li>
              <li>&#10003; Accomodation Type : {listing.accomoType} </li>
              <li>&#10003; Gender Preferances : {listing.genderPrefer}</li>
              <li>&#10003; Pets Allowed : {listing.petAllowed}</li>
              <li>&#10003; Power Backup : {listing.powerBackup}</li>
              <li>&#10003; Water Suuply : {listing.waterSupply}</li>
              <li>&#10003; Flat Type : {listing.flatType}</li>
              <li>&#10003; Total Flat : {listing.totalFlat}</li>
              <li>&#10003; All Flat Price are Different</li>
              <li>&#10003; Any Offer : {listing.Offer}</li>
            
            </ul>
          </div>

          <div>
            <p>BHK : {listing.BHK} {listing.Type}</p>
            <p>Adress : {listing.Adress}</p>
            <p>LandMark : {listing.landmark}</p>

          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Parking</h3>
            <ul>
              {listing.parking.map((parking, index) => (
                <li key={index}>&#10003; {parking}</li>
              ))}
            </ul>
          </div>


          <div className="mt-6">
            <h3 className="font-semibold text-lg">Prefer Tenants</h3>
            <ul>
              {listing.preferTenants.map((preferTenants, index) => (
                <li key={index}>&#10003; {preferTenants}</li>
              ))}
            </ul>
          </div>
        
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Flat Inside Facilities</h3>
            <ul>
              {listing.flatInside.map((inside, index) => (
                <li key={index}>&#10003; {inside}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Prefer Tenants</h3>
            <ul>
              {listing.flatOutside.map((outside, index) => (
                <li key={index}>&#10003; {outside}</li>
              ))}
            </ul>
          </div>
            {/* {alreadyContactData ? (
              <div>
              <p>Owner Name : {alreadyContactData.contactInfo.ownerName}</p>
              <p>Owner Mobile No : {alreadyContactData.contactInfo.ownerMobile}</p>
              <p>Contact display until: {new Date(alreadyContactData.contactInfo.expiryTime).toLocaleString('en-CA')}</p>
              {new Date(alreadyContactData.contactInfo.expiryTime) < new Date() && (
                <button onClick={contact}>Contact Owner</button>
              )}
              </div>
            ) : (
              <button onClick={contact} disabled={ownerData !== null}>Contact Owner</button>
            )} : <div>
            {ownerData && (
              <div>
                <p>Owner Name : {ownerData.contactInfo.ownerName}</p>
                <p>Owner Mobile No : {ownerData.contactInfo.ownerMobile}</p>
                <p>Contact display until: {new Date(ownerData.contactInfo.expiryTime).toLocaleString('en-CA')}</p>
              </div>
            )} */}
          {/* </div> */}
          
          
        </div>
      </div>
    </div>
  </div></>
  );
}
