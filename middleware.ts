import { NextRequest, NextResponse } from "next/server";

import { User } from "./context/AuthContext";

// Definir rutas protegidas y sus permisos requeridos
const PROTECTED_ROUTES: Record<string, PermissionConfig> = {
  "/": {
    permissions: ["gestor_servicio", "gestor_planillas", "admin"],
    errorMessage:
      "Necesitas ser gestor de servicios, gestor de planillas o administrador para acceder a esta sección",
  },
  "/liquidaciones": {
    permissions: ["liquidador", "admin"],
    errorMessage: "Necesitas ser liquidador para acceder a esta sección",
  },
  "/historico": {
    permissions: ["liquidador", "facturador", "admin"],
    errorMessage: "Necesitas ser liquidador para acceder a esta sección",
  },
  // Añadir más rutas protegidas según sea necesario
};

// Configuración de permisos
interface PermissionConfig {
  permissions: string[];
  errorMessage: string;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  console.log(`[Middleware] Procesando ruta: ${path}`);

  // ✨ NUEVO: Verificar si es una ruta pública con token
  if (path.startsWith("/servicio/") && url.searchParams.has("token")) {
    console.log(`[Middleware] Ruta pública detectada: ${path}?token=...`);

    // Permitir acceso sin verificar autenticación
    return NextResponse.next();
  }

  // Verificar si la ruta requiere permisos específicos
  const permissionConfig = getRequiredPermissions(path);

  if (permissionConfig && permissionConfig.permissions.length > 0) {
    console.log(
      `[Middleware] Ruta protegida: ${path}, requiere permisos:`,
      permissionConfig.permissions,
    );

    // Obtener información del usuario desde la cookie
    const userInfoCookie = request.cookies.get("userInfo")?.value;
    const tokenCookie = request.cookies.get("token")?.value;

    if (!userInfoCookie || !tokenCookie) {
      console.log(`[Middleware] No hay cookie de userInfo o token`);

      // Si no hay información de usuario o token, redirigir a login
      return redirectToLoginWithError(
        url,
        "Debe iniciar sesión para acceder a esta página",
      );
    }

    try {
      // Parsear la información del usuario
      const userInfo = JSON.parse(userInfoCookie) as User;

      console.log(
        `[Middleware] Usuario: ${userInfo.nombre}, Rol: ${userInfo.role}`,
      );

      // Verificar si el usuario tiene los permisos necesarios
      const hasPermission = checkPermissions(
        userInfo,
        permissionConfig.permissions,
      );

      console.log(
        `[Middleware] ¿Tiene permisos? ${hasPermission ? "SÍ" : "NO"}`,
      );

      if (!hasPermission) {
        console.log(`[Middleware] Acceso denegado a ${path}`);

        // Redirigir a una página de error
        return redirectToError(url, permissionConfig.errorMessage);
      }

      // Añadir información adicional al request
      const requestHeaders = new Headers(request.headers);

      requestHeaders.set("x-user-role", userInfo.role || "usuario");
      requestHeaders.set(
        "x-user-permissions",
        JSON.stringify(userInfo.permisos || {}),
      );

      console.log(`[Middleware] Acceso permitido a ${path}`);

      // Usuario tiene permisos, continuar
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("[Middleware] Error al parsear la cookie userInfo:", error);

      return redirectToLoginWithError(
        url,
        "Error en la sesión. Por favor, inicie sesión nuevamente",
      );
    }
  } else {
    console.log(`[Middleware] Ruta pública o no configurada: ${path}`);
  }

  // Si la ruta no requiere permisos específicos, continuar
  return NextResponse.next();
}

// Configurar las rutas donde se aplica el middleware
export const config = {
  matcher: [
    "/",
    "/liquidaciones/:path*",
    "/planillas/:path*",
    // Excluir rutas de servicio público con token
    "/((?!_next/static|_next/image|favicon\\.ico|public/|api/|login|error|servicio/).*)",
  ],
};

// Función para obtener los permisos requeridos para una ruta
function getRequiredPermissions(path: string): PermissionConfig | null {
  // Buscar la ruta más específica primero
  const exactMatch = PROTECTED_ROUTES[path];

  if (exactMatch) return exactMatch;

  // Si no hay una coincidencia exacta, buscar rutas padre
  // Ordenamos las rutas de más específicas a menos específicas para evitar falsos positivos
  const routes = Object.keys(PROTECTED_ROUTES).sort(
    (a, b) => b.length - a.length,
  );

  for (const route of routes) {
    if (path.startsWith(route)) {
      return PROTECTED_ROUTES[route];
    }
  }

  return null;
}

// Función para verificar si el usuario tiene los permisos necesarios
function checkPermissions(
  userInfo: User,
  requiredPermissions: string[],
): boolean {
  console.log(
    "Verificando permisos:",
    userInfo.role,
    "Permisos requeridos:",
    requiredPermissions,
  );
  console.log("Permisos del usuario:", userInfo.permisos);

  // Si el usuario tiene role 'admin', darle acceso a todas las rutas
  if (userInfo.role === "admin") {
    console.log("Usuario es admin, acceso permitido");

    return true;
  }

  // Si userInfo.permisos no existe, continuar verificando el rol
  if (!userInfo.permisos) {
    console.log("El usuario no tiene permisos definidos");

    // Verificar si el rol del usuario está entre los permisos requeridos
    return requiredPermissions.includes(userInfo.role);
  }

  // Verificar si el usuario tiene alguno de los permisos requeridos
  for (const permission of requiredPermissions) {
    // 1. Verificar si el permiso coincide exactamente con el rol
    if (permission === userInfo.role) {
      console.log(`Rol coincide con permiso requerido: ${permission}`);

      return true;
    }

    // 2. Verificar si el permiso existe como una propiedad true en userInfo.permisos
    if (userInfo.permisos[permission] === true) {
      console.log(`Usuario tiene el permiso requerido: ${permission}`);

      return true;
    }
  }

  console.log("El usuario no tiene ninguno de los permisos requeridos");

  return false;
}

// Función para redirigir a la página de login con un mensaje de error
function redirectToLoginWithError(
  url: URL,
  errorMessage: string,
): NextResponse {
  const loginUrl = new URL("/login", url.origin);

  loginUrl.searchParams.set("error", errorMessage);
  loginUrl.searchParams.set("redirectTo", url.pathname + url.search);

  return NextResponse.redirect(loginUrl);
}

// Función para generar una respuesta de error que será capturada por el error boundary
function redirectToError(url: URL, errorMessage: string): NextResponse {
  console.log(
    `[Middleware] Redirigiendo a error page con mensaje: ${errorMessage}`,
  );

  // Crear una URL para la página de error con el mensaje como parámetro
  const errorUrl = new URL("/error", url.origin);

  errorUrl.searchParams.set("message", errorMessage);
  errorUrl.searchParams.set("statusCode", "403");

  // Usar redirect en lugar de rewrite para asegurar que el usuario vea la página de error
  return NextResponse.redirect(errorUrl);
}
