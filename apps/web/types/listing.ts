interface Listing {
    id: string;
    Adress: string;
    BHK: string;
    MaxPrice: string;
    MinPrice: string;
    Offer: string;
    Type: string;
    accomType: string;
    ageOfProperty: string;
    city: string;
    flatInside: string[];
    flatOutside: string[];
    flatType: string;
    furnishingType: string;
    genderPrefer: string;
    images: string[];
    isVerified: boolean;
    isVisible: boolean;
    location: string;
    maintenance: string;
    parking: string[];
    petsAllowed: boolean;
    powerBackup: string;
    preferTenants: string[];
    security: string;
    townSector: string;
    waterSupply: string;
    totalFlat : number;
}
  
interface ListingData {
    listings: Listing[];
}
export default ListingData;  