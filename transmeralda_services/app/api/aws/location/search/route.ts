// /api/aws/location/search/route.ts
import { NextResponse } from 'next/server';
import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";

export async function GET(request) {
  // Extraer parámetros de la URL
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const country = "COL"; // Colombia por defecto
  
  if (!text) {
    return NextResponse.json(
      { error: 'El parámetro de búsqueda (text) es requerido' },
      { status: 400 }
    );
  }

  // Obtener configuración desde variables de entorno
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const placeIndexName = process.env.AWS_LOCATION_PLACE_INDEX;
  
  if (!accessKeyId || !secretAccessKey || !region || !placeIndexName) {
    return NextResponse.json(
      { error: 'Error de configuración: Credenciales o índice no disponibles' },
      { status: 500 }
    );
  }

  try {
    // Configurar el cliente de Location con credenciales IAM
    const locationClient = new LocationClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    // Configurar los parámetros para la búsqueda
    const params = {
      IndexName: placeIndexName,
      Text: text,
      FilterCountries: [country],
      MaxResults: 5,
      Language: 'es'
    };

    // Ejecutar la búsqueda
    const command = new SearchPlaceIndexForTextCommand(params);
    const response = await locationClient.send(command);

    console.log(response)

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error al consultar Amazon Location Service:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al consultar el servicio de geocodificación',
        details: error.message,
        code: error.Code || error.$metadata?.httpStatusCode
      },
      { status: 500 }
    );
  }
}