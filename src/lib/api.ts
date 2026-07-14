import axios from "axios";
import type { 
  Place, 
  PlaceType, 
  SearchResult, 
  NominatimResult, 
  OverpassElement 
} from "@/types";

// internal: http client for the overpass openstreetmap api
const overpassApi = axios.create({
 baseURL: "https://overpass-api.de/api",
 timeout: 15000,
 headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

// internal: http client for reverse geocoding and location search
const nominatimApi = axios.create({
 baseURL: "https://nominatim.openstreetmap.org",
 timeout: 10000,
 headers: {
 "Accept": "application/json",
 // nominatim requires a user-agent string
 "User-Agent": "AnimalRescueConnect/1.0 (contact@rescueconnect.app)",
 },
});

// helper: find nearby animal-related places via overpass
export async function fetchNearbyPlaces(lat: number, lng: number, radiusMeters = 100000) {
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

// helper: reverse geocode a lat/lng into a readable address
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
 const { data } = await nominatimApi.get<NominatimResult>("/reverse", {
 params: { lat, lon: lng, format: "json" },
 });
 return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// helper: search for a location by query string
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

// helper: fetch a driving route via osrm
export async function fetchRoute(startLng: number, startLat: number, endLng: number, endLat: number): Promise<[number, number][]> {
  try {
    const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`);
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates as [number, number][];
    }
  } catch (e) {
    console.error("Route fetch failed", e);
  }
  // fallback to straight line
  return [[startLng, startLat], [endLng, endLat]];
}

// helper: fetch place details by OSM node ID
export async function fetchPlaceDetails(id: string): Promise<Place | null> {
  try {
    const query = `
    [out:json][timeout:15];
    node(${id});
    out body;
    `;
    const { data } = await overpassApi.post<{ elements: OverpassElement[] }>(
      "/interpreter",
      `data=${encodeURIComponent(query)}`
    );
    if (data.elements && data.elements.length > 0) {
      const el = data.elements[0];
      const tags = (el.tags || {}) as Record<string, string | undefined>;
      return {
        id: el.id,
        lat: el.lat,
        lng: el.lon,
        name: tags.name || "Verified Rescue Facility",
        type: resolveType(el.tags || {}),
        phone: tags.phone || tags["contact:phone"],
        hours: tags.opening_hours || "Open (Hours unlisted)",
        website: tags.website || tags["contact:website"],
      };
    }
  } catch (e) {
    console.error("Failed to fetch place details", e);
  }
  return null;
}

// helper: resolve types
function resolveType(tags: OverpassElement["tags"]): PlaceType {
  if (tags.amenity === "veterinary") return "veterinary";
  if (tags.amenity === "animal_shelter") return "shelter";
  if (tags.shop === "pet") return "pet_shop";
  return "hospital";
}
