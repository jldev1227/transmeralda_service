// app/api/wialon-api/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Exporta una función nombrada para el método POST
export async function POST(request: NextRequest) {
  try {
    // Obtiene el cuerpo de la solicitud como JSON
    const { token, service, params } = await request.json();

    // Validar que los datos necesarios estén presentes (opcional pero recomendado)
    if ((!token && service !== "token/login") || !service || !params) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: token, service, params" },
        { status: 400 },
      );
    }

    const response = await axios.post(
      "https://hst-api.wialon.com/wialon/ajax.html",
      new URLSearchParams({
        svc: service,
        params: JSON.stringify(params),
        sid: token, // Asegúrate de que 'token' sea el 'sid' esperado por Wialon
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    // Devuelve la respuesta de Wialon usando NextResponse
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    // Es buena práctica tipar el error si es posible, o usar 'any'/'unknown'
    console.error("Error al comunicarse con Wialon:", error);

    // Manejo de errores de Axios específicamente si es necesario
    let errorMessage = "Error al comunicarse con Wialon";
    let errorDetails =
      error instanceof Error ? error.message : "Error desconocido";
    let statusCode = 500; // Error interno del servidor por defecto

    if (axios.isAxiosError(error)) {
      // Puedes acceder a error.response, error.request, etc.
      errorDetails = error.response?.data || error.message;
      // Si Wialon devuelve un código de error específico, podrías pasarlo
      // statusCode = error.response?.status || 500;
    }

    // Devuelve una respuesta de error usando NextResponse
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: statusCode }, // Usa el código de estado apropiado
    );
  }
}

// Opcional: Si quieres explícitamente denegar otros métodos
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
