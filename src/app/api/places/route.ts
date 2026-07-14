import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "100000"; // default to 100km if not provided

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat/lng parameters" }, { status: 400 });
  }

  const query = `
  [out:json][timeout:25];
  (
    node["amenity"="veterinary"](around:${radius},${lat},${lng});
    node["amenity"="animal_shelter"](around:${radius},${lat},${lng});
    node["shop"="pet"](around:${radius},${lat},${lng});
    node["amenity"="hospital"]["animal"](around:${radius},${lat},${lng});
  );
  out body;
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
        timeout: 20000
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Overpass proxy error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch from Overpass API", details: error.message },
      { status: 500 }
    );
  }
}
