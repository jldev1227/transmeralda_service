// app/api/places/details/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get("place_id");

    if (!placeId) {
      return NextResponse.json(
        { error: "Parameter 'place_id' is required" },
        { status: 400 },
      );
    }

    // Campos a solicitar (incluye geometry para obtener coordenadas)
    const fields =
      searchParams.get("fields") ||
      "address_component,formatted_address,geometry,name,place_id";
    const sessiontoken = searchParams.get("sessiontoken");

    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );

    url.searchParams.append("place_id", placeId);
    url.searchParams.append("fields", fields);
    url.searchParams.append("key", GOOGLE_MAPS_API_KEY!);

    if (sessiontoken) {
      url.searchParams.append("sessiontoken", sessiontoken);
    }

    const response = await axios.get(url.toString());

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
      { status: statusCode },
    );
  }
}
