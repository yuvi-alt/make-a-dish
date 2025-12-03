import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input || typeof input !== "string") {
    return NextResponse.json(
      { error: "input parameter is required" },
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
    // Check if input looks like a postcode (UK format: letters, numbers, optional space)
    // Also match patterns like "SW1A 1AA", "SW1A1AA", "M1 1AA", etc.
    const ukPostcodePattern = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    const isPostcode = ukPostcodePattern.test(input.trim()) || 
                       (/^\d{5}(-\d{4})?$/.test(input.trim()) && input.trim().length <= 10); // US zipcode pattern as fallback
    
    // For postcodes or short queries, try both autocomplete and geocoding
    // Remove types restriction for better postcode support
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Google Places API returned status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    
    // If no results and it looks like a postcode, try geocoding API as fallback
    if ((data.status === "ZERO_RESULTS" || (data.predictions?.length === 0)) && isPostcode) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=${apiKey}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status === "OK" && geocodeData.results?.length > 0) {
        // Convert geocoding results to autocomplete-like format
        const predictions = geocodeData.results.map((result: any, index: number) => ({
          place_id: result.place_id,
          description: result.formatted_address,
          structured_formatting: {
            main_text: result.formatted_address.split(",")[0],
            secondary_text: result.formatted_address.split(",").slice(1).join(",").trim(),
          },
          types: result.types,
        }));
        
        return NextResponse.json({
          ...data,
          status: "OK",
          predictions,
          fromGeocoding: true,
        });
      }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Google Places autocomplete:", error);
    return NextResponse.json(
      { error: "Failed to fetch address suggestions. Please try again." },
      { status: 500 },
    );
  }
}

