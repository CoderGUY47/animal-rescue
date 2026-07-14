import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "50000";

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  // Query both nodes AND ways to get full OSM coverage (Bangladesh uses both)
  const query = `
  [out:json][timeout:30];
  (
    node["amenity"="veterinary"](around:${radius},${lat},${lng});
    way["amenity"="veterinary"](around:${radius},${lat},${lng});
    node["amenity"="animal_shelter"](around:${radius},${lat},${lng});
    way["amenity"="animal_shelter"](around:${radius},${lat},${lng});
    node["shop"="pet"](around:${radius},${lat},${lng});
    way["shop"="pet"](around:${radius},${lat},${lng});
    node["amenity"="hospital"]["animal"](around:${radius},${lat},${lng});
    way["amenity"="hospital"]["animal"](around:${radius},${lat},${lng});
    node["amenity"="clinic"]["animal"](around:${radius},${lat},${lng});
    way["amenity"="clinic"]["animal"](around:${radius},${lat},${lng});
    node["name"~"vet|veterinary|animal|pet|পশু|clinic",i](around:${radius},${lat},${lng});
    node["healthcare"="veterinary"](around:${radius},${lat},${lng});
  );
  out center;
  `;

  try {
    const { data } = await axios.post(
      "https://overpass-api.de/api/interpreter",
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "AnimalRescueConnect/1.0 (contact@rescueconnect.app)"
        },
        timeout: 25000
      }
    );

    // Normalize: ways use center coords, nodes use lat/lon directly
    const normalized = data.elements?.map((el: any) => ({
      ...el,
      lat: el.lat ?? el.center?.lat,
      lon: el.lon ?? el.center?.lon,
    })).filter((el: any) => el.lat && el.lon) ?? [];

    return NextResponse.json({ ...data, elements: normalized });
  } catch (error: any) {
    console.error("Overpass proxy error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch from Overpass API", details: error.message },
      { status: 500 }
    );
  }
}
