import { NextResponse } from "next/server";
import axios from "axios";

// Try multiple Overpass mirrors in order — use fastest that responds
const OVERPASS_MIRRORS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

async function queryOverpass(query: string): Promise<any[] | null> {
  for (const endpoint of OVERPASS_MIRRORS) {
    try {
      const { data } = await axios.post(
        endpoint,
        `data=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "AnimalRescueConnect/1.0 (rescueconnect@email.com)",
          },
          timeout: 7000, // 7s per mirror — well within Vercel's 10s limit
        }
      );
      const elements = data.elements ?? [];
      if (elements.length >= 0) return elements; // accept even empty result
    } catch {
      // try next mirror
      continue;
    }
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "10000";

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  const r = Math.min(Number(radius), 15000); // cap at 15km for speed

  // Simple focused query — only the most common OSM tags for animal places
  const query = `
[out:json][timeout:6];
(
  node["amenity"="veterinary"](around:${r},${lat},${lng});
  way["amenity"="veterinary"](around:${r},${lat},${lng});
  node["shop"="pet"](around:${r},${lat},${lng});
  way["shop"="pet"](around:${r},${lat},${lng});
  node["amenity"="animal_shelter"](around:${r},${lat},${lng});
  way["amenity"="animal_shelter"](around:${r},${lat},${lng});
  node["healthcare"="veterinary"](around:${r},${lat},${lng});
  node["animal"="yes"](around:${r},${lat},${lng});
  node["name"~"vet|animal|pet|পশু|clinic",i]["amenity"](around:${r},${lat},${lng});
);
out center;
`;

  try {
    const elements = await queryOverpass(query);

    if (elements === null) {
      return NextResponse.json({ elements: [] });
    }

    // Normalize: ways have center coords, nodes have lat/lon directly
    const normalized = elements
      .map((el: any) => ({
        ...el,
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
      }))
      .filter((el: any) => el.lat && el.lon);

    return NextResponse.json({ elements: normalized });
  } catch (error: any) {
    console.error("Places proxy error:", error.message);
    return NextResponse.json({ elements: [] });
  }
}
