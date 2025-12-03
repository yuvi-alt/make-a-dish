import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testQuery = searchParams.get("query") || "10 Downing Street, London";

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { 
        error: "API key not configured",
        apiKeyExists: false,
        testQuery 
      },
      { status: 500 },
    );
  }

  try {
    // Test Autocomplete API
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(testQuery)}&types=address&key=${apiKey}`;
    const autocompleteResponse = await fetch(autocompleteUrl);
    const autocompleteData = await autocompleteResponse.json();

    // Test Geocoding API (better for postcodes)
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(testQuery)}&key=${apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    return NextResponse.json({
      apiKeyExists: true,
      apiKeyLength: apiKey.length,
      testQuery,
      autocomplete: {
        status: autocompleteData.status,
        predictions: autocompleteData.predictions?.length || 0,
        errorMessage: autocompleteData.error_message,
        sample: autocompleteData.predictions?.[0] || null,
      },
      geocoding: {
        status: geocodeData.status,
        results: geocodeData.results?.length || 0,
        errorMessage: geocodeData.error_message,
        sample: geocodeData.results?.[0] || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error",
        apiKeyExists: true,
        testQuery 
      },
      { status: 500 },
    );
  }
}

