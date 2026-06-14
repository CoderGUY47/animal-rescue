export type PlaceType = "veterinary" | "shelter" | "pet_shop" | "hospital";

export type Place = {
  id: number;
  lat: number;
  lng: number;
  name: string;
  type: PlaceType;
  phone?: string;
  hours?: string;
  website?: string;
};

export type OverpassElement = {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    shop?: string;
    phone?: string;
    website?: string;
    "opening_hours"?: string;
  };
};

export type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export type SearchResult = {
  name: string;
  lat: number;
  lng: number;
};
