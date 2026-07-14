import { NextResponse } from "next/server";
import axios from "axios";

const FSQ_KEY = process.env.FOURSQUARE_API_KEY;

// Foursquare category IDs for animal/pet places
// 17069 = Veterinarian, 11134 = Pet Store, 17067 = Animal Shelter, 15014 = Animal Rescue Service
const FSQ_CATEGORIES = "17069,11134,17067,15014";

async function fetchFromFoursquare(lat: string, lng: string, radius: string) {
  if (!FSQ_KEY) return null;

  const { data } = await axios.get("https://api.foursquare.com/v3/places/search", {
    headers: {
      Authorization: FSQ_KEY,
      Accept: "application/json",
    },
    params: {
      ll: `${lat},${lng}`,
      radius: Math.min(Number(radius), 15000),
      categories: FSQ_CATEGORIES,
      limit: 50,
      fields: "fsq_id,name,geocodes,categories,location,tel,website,hours",
    },
    timeout: 8000,
  });

  const results = data.results ?? [];

  return results.map((p: any) => {
    const cat = p.categories?.[0]?.id ?? 0;
    let type: string;
    if (cat === 11134) type = "pet_shop";
    else if (cat === 17067 || cat === 15014) type = "shelter";
    else type = "veterinary";

    return {
      id: p.fsq_id,
      type,
      lat: p.geocodes?.main?.latitude,
      lon: p.geocodes?.main?.longitude,
      tags: {
        name: p.name,
        amenity: type === "pet_shop" ? "shop" : "veterinary",
        phone: p.tel,
        website: p.website,
        "opening_hours": p.hours?.display ?? undefined,
      },
    };
  }).filter((p: any) => p.lat && p.lon);
}

// Overpass fallback with fast mirrors queried in parallel
async function fetchFromOverpass(lat: string, lng: string, radius: string) {
  const mirrors = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter",
  ];

  const r = Math.min(Number(radius), 15000);
  const query = `
[out:json][timeout:5];
(
  node["amenity"="veterinary"](around:${r},${lat},${lng});
  way["amenity"="veterinary"](around:${r},${lat},${lng});
  node["shop"="pet"](around:${r},${lat},${lng});
  way["shop"="pet"](around:${r},${lat},${lng});
  node["amenity"="animal_shelter"](around:${r},${lat},${lng});
  node["healthcare"="veterinary"](around:${r},${lat},${lng});
);
out center;
`;

  const promises = mirrors.map(async (endpoint) => {
    const { data } = await axios.post(
      endpoint,
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "AnimalRescueConnect/1.0",
        },
        timeout: 5000,
      }
    );
    if (!data.elements) {
      throw new Error("No elements in response");
    }
    return data.elements;
  });

  try {
    const elements = await Promise.any(promises);
    return elements
      .map((el: any) => ({
        ...el,
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
      }))
      .filter((el: any) => el.lat && el.lon);
  } catch (err) {
    console.error("All Overpass mirrors failed or timed out");
    return [];
  }
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
    // 1. Try Foursquare (free, no billing, great Bangladesh coverage)
    if (FSQ_KEY) {
      try {
        const fsqResults = await fetchFromFoursquare(lat, lng, radius);
        if (fsqResults && fsqResults.length > 0) {
          return NextResponse.json({ elements: fsqResults, source: "foursquare" });
        }
      } catch (e: any) {
        console.error("Foursquare error:", e.message);
      }
    }

    // 2. Fallback: OpenStreetMap Overpass
    const elements = await fetchFromOverpass(lat, lng, radius);
    return NextResponse.json({ elements, source: "osm" });
  } catch (error: any) {
    console.error("Places proxy error:", error.message);
    return NextResponse.json({ elements: [] });
  }
}
