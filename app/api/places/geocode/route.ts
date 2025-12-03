import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || typeof address !== "string") {
    return NextResponse.json(
      { error: "address parameter is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API key is not configured" },
      { status: 500 },
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Google Geocoding API returned status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Google Geocoding:", error);
    return NextResponse.json(
      { error: "Failed to geocode address. Please try again." },
      { status: 500 },
    );
  }
}

