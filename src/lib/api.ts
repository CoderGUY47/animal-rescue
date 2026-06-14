import axios from "axios";

// ─── Overpass API (find nearby places via OpenStreetMap) ─────────────────────
export const overpassApi = axios.create({
 baseURL: "https://overpass-api.de/api",
 timeout: 15000,
 headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

// ─── Nominatim API (reverse geocoding: lat/lng → human address) ──────────────
export const nominatimApi = axios.create({
 baseURL: "https://nominatim.openstreetmap.org",
 timeout: 10000,
 headers: {
 "Accept": "application/json",
 // Nominatim requires a User-Agent string
 "User-Agent": "AnimalRescueConnect/1.0 (contact@rescueconnect.app)",
 },
});

// ─── Helper: find nearby animal-related places via Overpass ─────────────────
export async function fetchNearbyPlaces(lat: number, lng: number, radiusMeters = 5000) {
 const query = `
 [out:json][timeout:25];
 (
 node["amenity"="veterinary"](around:${radiusMeters},${lat},${lng});
 node["amenity"="animal_shelter"](around:${radiusMeters},${lat},${lng});
 node["shop"="pet"](around:${radiusMeters},${lat},${lng});
 node["amenity"="hospital"]["animal"](around:${radiusMeters},${lat},${lng});
 );
 out body;
 `;

 const { data } = await overpassApi.post<{ elements: OverpassElement[] }>(
 "/interpreter",
 `data=${encodeURIComponent(query)}`
 );

 return data.elements
 .filter((el) => el.tags?.name)
 .map((el) => ({
 id: el.id,
 lat: el.lat,
 lng: el.lon,
 name: el.tags.name!,
 type: resolveType(el.tags),
 phone: el.tags.phone,
 hours: el.tags["opening_hours"],
 website: el.tags.website,
 }));
}

// ─── Helper: reverse geocode a lat/lng into a readable address ───────────────
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
 const { data } = await nominatimApi.get<NominatimResult>("/reverse", {
 params: { lat, lon: lng, format: "json" },
 });
 return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// ─── Helper: search for a location by query string ───────────────────────────
export async function searchLocation(query: string): Promise<SearchResult[]> {
 const { data } = await nominatimApi.get<NominatimResult[]>("/search", {
 params: { q: query, format: "json", limit: 5 },
 });
 return data.map(item => ({
 name: item.display_name,
 lat: parseFloat(item.lat),
 lng: parseFloat(item.lon)
 }));
}

// ─── Helper: fetch a driving route via OSRM ──────────────────────────────────
export async function fetchRoute(startLng: number, startLat: number, endLng: number, endLat: number): Promise<[number, number][]> {
  try {
    const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`);
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates as [number, number][];
    }
  } catch (e) {
    console.error("Route fetch failed", e);
  }
  // Fallback to straight line
  return [[startLng, startLat], [endLng, endLat]];
}

// ─── Types ──────────────────────────────────────────────────────────────────
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

type OverpassElement = {
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

type NominatimResult = {
 display_name: string;
 lat: string;
 lon: string;
};

export type SearchResult = {
 name: string;
 lat: number;
 lng: number;
};

function resolveType(tags: OverpassElement["tags"]): PlaceType {
 if (tags.amenity === "veterinary") return "veterinary";
 if (tags.amenity === "animal_shelter") return "shelter";
 if (tags.shop === "pet") return "pet_shop";
 return "hospital";
}
