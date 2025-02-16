import { ReactNode } from "react";

interface Listing {
    id: number;
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
  
type ListingData = {
    contactInfo: any;
    ownerId: number;
    id : number;
    images?: string[];
    location: string;
    city: string;
    townSector: string;
    MinPrice: string,
    MaxPrice: string;
    security: string;
    maintenance: string;
    noticePeriod: string;
    furnishingType: string;
    accomoType: string;
    genderPrefer: string;
    petAllowed: boolean;
    powerBackup: string;
    waterSupply: string;
    flatType: string;
    totalFlat: number;
    Offer: string;
    BHK: string;
    Type: string;
    Adress: string;
    landmark: string;
    parking: string[]
    preferTenants: string[];
    flatInside: string[];
    flatOutside: string[];
    listing?: ListingData[];
}


export interface ListingItem {
    id: string;
    uniq: string;
    type: string;
    imageUrl: string;
    location: string;
    townSector: string;
    city: string;
    BHK: number;
    security: number;
    MinPrice: number;
    MaxPrice: number;
    isVisible: boolean;
    isVerified: boolean;
  }

export default ListingData;  