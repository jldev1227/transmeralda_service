// app/api/wialon-api/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

let cachedSid: string | null = null;

const WIALON_BASE_URL = "https://hst-api.wialon.com/wialon/ajax.html";
const WIALON_TOKEN = process.env.WIALON_TOKEN!;

/**
 * 🔐 Inicia sesión usando token de Wialon
 */
async function wialonLogin() {
  console.log("🔐 Iniciando sesión con token de Wialon...");

  if (!WIALON_TOKEN) {
    throw new Error("Variable WIALON_TOKEN no configurada en el servidor");
  }

  try {
    const response = await axios.post(
      WIALON_BASE_URL,
      new URLSearchParams({
        svc: "token/login",
        params: JSON.stringify({ token: WIALON_TOKEN }),
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    console.log("📡 Respuesta de Wialon login:", response.data);

    if (response.data?.eid) {
      cachedSid = response.data.eid;
      console.log("✅ Nuevo SID obtenido con token:", cachedSid);
      return cachedSid;
    } else if (response.data?.error) {
      throw new Error(`Error de Wialon (${response.data.error}): ${response.data.reason || "Error de autenticación"}`);
    } else {
      throw new Error("Respuesta inesperada de Wialon: " + JSON.stringify(response.data));
    }
  } catch (error: any) {
    console.error("❌ Error en wialonLogin:", error.message);
    throw error;
  }
}

/**
 * 📡 Llamada genérica a cualquier servicio Wialon.
 * Reintenta automáticamente si el SID expira.
 */
async function callWialon(service: string, params: any) {
  if (!cachedSid) await wialonLogin();

  try {
    const response = await axios.post(
      WIALON_BASE_URL,
      new URLSearchParams({
        svc: service,
        params: JSON.stringify(params),
        sid: cachedSid!,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    // Si el SID expira (error 1, 4 o 8), renueva y reintenta
    if ([1, 4, 8].includes(response.data?.error)) {
      console.warn(`⚠️ SID expirado (${response.data.error}). Renovando con token...`);
      await wialonLogin();
      return await callWialon(service, params);
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ Error comunicándose con Wialon:", error.message);
    throw error;
  }
}

/**
 * 🔄 Route principal (Next.js API)
 */
export async function POST(request: NextRequest) {
  try {
    const { service, params, sid } = await request.json();
    console.log(`📞 Llamada API Wialon: ${service}`, { hasSid: !!sid });

    if (!service) {
      return NextResponse.json({ error: "Falta parámetro 'service'" }, { status: 400 });
    }

    // Si es un login directo, iniciar sesión y devolver el eid
    if (service === "core/login" || service === "token/login") {
      const newSid = await wialonLogin();
      return NextResponse.json({ eid: newSid }, { status: 200 });
    }

    // Para otros servicios, verificar que tengamos parámetros
    if (!params) {
      return NextResponse.json({ error: "Faltan parámetros 'params'" }, { status: 400 });
    }

    // Si tenemos un sid específico del frontend, usarlo directamente
    if (sid) {
      console.log(`🔧 Usando SID proporcionado: ${sid}`);
      try {
        const response = await axios.post(
          WIALON_BASE_URL,
          new URLSearchParams({
            svc: service,
            params: JSON.stringify(params),
            sid: sid,
          }).toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        );

        // Si el SID expira, intentar renovar automáticamente
        if ([1, 4, 8].includes(response.data?.error)) {
          console.warn(`⚠️ SID del frontend expirado (${response.data.error}). Renovando...`);
          const data = await callWialon(service, params);
          return NextResponse.json(data, { status: 200 });
        }

        return NextResponse.json(response.data, { status: 200 });
      } catch (error: any) {
        console.error("❌ Error con SID del frontend:", error.message);
        // Si falla, intentar con el SID del backend
        const data = await callWialon(service, params);
        return NextResponse.json(data, { status: 200 });
      }
    }

    // Si no hay SID del frontend, usar la función normal del backend
    const data = await callWialon(service, params);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error general API Wialon:", error.message);
    return NextResponse.json(
      { error: "Error al comunicarse con Wialon", details: error.message },
      { status: 500 },
    );
  }
}
