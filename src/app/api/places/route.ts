import { NextResponse } from "next/server";
import axios from "axios";

const FSQ_KEY = process.env.FOURSQUARE_API_KEY;

// Foursquare category IDs: 17069=Vet, 11134=Pet Store, 17067=Animal Shelter, 15014=Rescue
const FSQ_CATEGORIES = "17069,11134,17067,15014";

async function fetchFromFoursquare(lat: string, lng: string, radius: string) {
  if (!FSQ_KEY) throw new Error("No FSQ key");

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
    timeout: 4000, // fast fail — don't block Overpass
  });

  const results = (data.results ?? []) as any[];
  if (results.length === 0) throw new Error("No FSQ results");

  return results.map((p: any) => {
    const cat = p.categories?.[0]?.id ?? 0;
    const type = cat === 11134 ? "pet_shop" : (cat === 17067 || cat === 15014) ? "shelter" : "veterinary";
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
        opening_hours: p.hours?.display,
      },
    };
  }).filter((p: any) => p.lat && p.lon);
}

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

  // Race all mirrors — return from the first that responds
  const racePromises = mirrors.map(async (endpoint) => {
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
    const elements = (data.elements ?? [])
      .map((el: any) => ({
        ...el,
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
      }))
      .filter((el: any) => el.lat && el.lon);

    if (elements.length === 0) throw new Error("Empty OSM result");
    return elements;
  });

  return Promise.any(racePromises);
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
    // Run BOTH sources in parallel — return whichever wins
    const [fsqSettled, osmSettled] = await Promise.allSettled([
      fetchFromFoursquare(lat, lng, radius),
      fetchFromOverpass(lat, lng, radius),
    ]);

    // Prefer Foursquare if it has results
    if (fsqSettled.status === "fulfilled" && fsqSettled.value.length > 0) {
      return NextResponse.json({ elements: fsqSettled.value, source: "foursquare" });
    }

    // Fall back to OSM
    if (osmSettled.status === "fulfilled" && osmSettled.value.length > 0) {
      return NextResponse.json({ elements: osmSettled.value, source: "osm" });
    }

    // Both failed
    console.error("Both sources failed:", fsqSettled, osmSettled);
    return NextResponse.json({ elements: [] });
  } catch (error: any) {
    console.error("Places proxy error:", error.message);
    return NextResponse.json({ elements: [] });
  }
}
