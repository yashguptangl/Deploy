import Bedroom from "../../../assets/bedroom.jpg";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState , useEffect } from "react";


export default function User ({userId} : {userId: string}) {
  const router = useRouter();
  const [wishlist , setWishlist] = useState([]);

  useEffect(() =>{
    const fetchWishlist = async () =>{
      try{
        const { data: wishListData } = await axios.get(`http://localhost:3000/api/v1/user/wishlist/${userId}`);
        setWishlist(wishListData);

      }catch(err){
        console.log("Error fetching wishlist",err);
      }
    }
    fetchWishlist();
  },[userId]);

  const handleViewDetails = (listingId : string , type : string ) => {
    router.push(`/${type}/${listingId}`);
  }

  return (
    <>
      <div className="mb-96 flex justify-center ">
        <div className="w-full sm:w-2/3 ">
          <h1 className="p-2 font-lg text-center">Wishlist</h1>
          {wishlist.length === 0 ? (
            <p>No items in your Wishlist</p>
          ) : (
            { wishlist.map((item : any) => (
                <div className="bg-white flex flex-row md:flex-row items-center rounded-md shadow-md overflow-hidden">
                <div>
                  <img
                    src={Bedroom.src}
                    alt="Room"
                    className="w-full sm:w-44 h-40 object-cover p-4 md:p-4 md:h-40 md:w-72 rounded-xl ssm:p-2 mod:w-32 mod:h-28 ssm:h-24 ssm:w-28"
                  />
                </div>
    
                <div >
                  <p className="ssm:text-xs md:text-2xl mod:text-sm">
                    Lajpat Nagar, Sector 12, New Delhi
                  </p>
                  <h2 className="text-xl font-medium ssm:text-xs md:text-xl mod:text-base ">
                    1bhk | Security 3000 
                  </h2>
                  <p className="text-2xl text-green-600 font-bold ssm:text-base">
                    Rent: &nbsp; 5000 - 10000
                  </p>
                  <div className="flex items-center gap-20 mt-2 ssm:gap-6">
                    <img
                      src={Bedroom.src}
                      alt="Banglore"
                      className="h-6 w-32 object-cover ssm:h-4 ssm:w-20"
                    />
                    <button className="bg-orange-800 text-white rounded px-4 py-2 text-sm font-semibold ssm:text-xs ssm:px-2 ssm:py-1">
                      CONTACT 
                    </button>
                  </div>
                </div>
              </div>
              ))}
            
          )}
          
        </div>
      </div>
    </>
  );
}
