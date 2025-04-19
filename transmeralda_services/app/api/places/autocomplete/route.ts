// app/api/places/autocomplete/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// API key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
export async function GET(request: NextRequest) {
    console.log(request)
  try {
    // Get query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get('input');
    const components = searchParams.get('components') || 'country:co'; // Default to Colombia
    
    // Validate required parameters
    if (!input) {
      return NextResponse.json(
        { error: "Parameter 'input' is required" },
        { status: 400 }
      );
    }

    // Optional parameters
    const language = searchParams.get('language') || 'es'; // Default to Spanish
    const types = searchParams.get('types');
    const sessiontoken = searchParams.get('sessiontoken');
    
    // Construct URL with parameters
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.append('input', input);
    url.searchParams.append('components', components);
    url.searchParams.append('language', language);
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY!);
    
    if (types) url.searchParams.append('types', types);
    if (sessiontoken) url.searchParams.append('sessiontoken', sessiontoken);

    // Make request to Google Places API
    const response = await axios.get(url.toString());

    // Return the response
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error communicating with Google Places API:", error);

    let errorMessage = "Error communicating with Google Places API";
    let errorDetails = error instanceof Error ? error.message : "Unknown error";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorDetails = error.response?.data || error.message;
      statusCode = error.response?.status || 500;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: statusCode }
    );
  }
}

// For place details (when a user selects a place)
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const { placeId, fields, sessiontoken } = await request.json();

    // Validate required parameters
    if (!placeId) {
      return NextResponse.json(
        { error: "Parameter 'placeId' is required" },
        { status: 400 }
      );
    }

    // Construct URL for place details
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY!);
    
    // Optional parameters
    if (fields) url.searchParams.append('fields', fields);
    if (sessiontoken) url.searchParams.append('sessiontoken', sessiontoken);

    // Make request to Google Places API
    const response = await axios.get(url.toString());

    // Return the response
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching place details:", error);

    let errorMessage = "Error fetching place details";
    let errorDetails = error instanceof Error ? error.message : "Unknown error";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorDetails = error.response?.data || error.message;
      statusCode = error.response?.status || 500;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: statusCode }
    );
  }
}