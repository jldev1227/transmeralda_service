// app/api/wialon-proxy/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await request.json();
    const { svc, params, sid } = body;
    
    // Realizar la solicitud a Wialon
    const response = await axios.post('https://hst-api.wialon.com/wialon/ajax.html', null, {
      params: {
        svc,
        params: typeof params === 'string' ? params : JSON.stringify(params),
        sid
      }
    });
    
    console.log("Respuesta de Wialon:", response.data);
    
    // Devolver la respuesta al cliente
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error al comunicarse con Wialon:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al comunicarse con Wialon',
        details: error.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
}