import { NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Google Places Nearby Search - returns real businesses from Google Maps database
async function fetchFromGoogle(lat: string, lng: string, radius: string) {
  if (!GOOGLE_API_KEY) return null;

  const types = ["veterinary_care", "pet_store", "animal_shelter"];
  const allPlaces: any[] = [];

  for (const type of types) {
    try {
      const { data } = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${lat},${lng}`,
            radius: Math.min(Number(radius), 50000),
            type,
            key: GOOGLE_API_KEY,
          },
          timeout: 8000,
        }
      );
      if (data.status === "OK" && data.results?.length) {
        allPlaces.push(...data.results);
      }
    } catch (e: any) {
      console.error(`Google Places error for type ${type}:`, e.message);
    }
  }

  // Deduplicate by place_id
  const seen = new Set<string>();
  return allPlaces
    .filter((p) => {
      if (seen.has(p.place_id)) return false;
      seen.add(p.place_id);
      return true;
    })
    .map((p) => ({
      id: p.place_id,
      type: p.types?.includes("pet_store")
        ? "pet_shop"
        : p.types?.includes("animal_shelter") || p.name?.toLowerCase().includes("shelter")
        ? "shelter"
        : "veterinary",
      lat: p.geometry.location.lat,
      lon: p.geometry.location.lng,
      tags: {
        name: p.name,
        amenity: p.types?.[0] ?? "veterinary",
        phone: p.formatted_phone_number,
        "opening_hours": p.opening_hours?.open_now ? "Open Now" : undefined,
        website: p.website,
      },
    }));
}

// Overpass fallback - simplified fast query under 8s
async function fetchFromOverpass(lat: string, lng: string, radius: string) {
  const r = Math.min(Number(radius), 10000); // cap at 10km for speed
  const query = `
  [out:json][timeout:7];
  (
    node["amenity"="veterinary"](around:${r},${lat},${lng});
    way["amenity"="veterinary"](around:${r},${lat},${lng});
    node["shop"="pet"](around:${r},${lat},${lng});
    way["shop"="pet"](around:${r},${lat},${lng});
    node["amenity"="animal_shelter"](around:${r},${lat},${lng});
    node["healthcare"="veterinary"](around:${r},${lat},${lng});
    node["name"~"vet|animal|pet shop|পশু",i](around:${r},${lat},${lng});
  );
  out center;
  `;

  const { data } = await axios.post(
    "https://overpass-api.de/api/interpreter",
    `data=${encodeURIComponent(query)}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "AnimalRescueConnect/1.0 (contact@rescueconnect.app)",
      },
      timeout: 8000,
    }
  );

  return (data.elements ?? [])
    .map((el: any) => ({
      ...el,
      lat: el.lat ?? el.center?.lat,
      lon: el.lon ?? el.center?.lon,
    }))
    .filter((el: any) => el.lat && el.lon);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "10000";

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  try {
    // Try Google Places first — best coverage for Bangladesh
    if (GOOGLE_API_KEY) {
      const googleResults = await fetchFromGoogle(lat, lng, radius);
      if (googleResults && googleResults.length > 0) {
        return NextResponse.json({ elements: googleResults });
      }
    }

    // Fallback: Overpass OSM
    const elements = await fetchFromOverpass(lat, lng, radius);
    return NextResponse.json({ elements });
  } catch (error: any) {
    console.error("Places proxy error:", error.message);
    return NextResponse.json({ elements: [] });
  }
}
