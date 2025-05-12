// RootLayout.tsx (componente servidor)
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { ClientLayout } from "./client-layout"; // Componente cliente que crearemos

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { AuthGuard } from "@/components/authGuard";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "white" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // Esta es la propiedad clave para las áreas seguras
};

// Componente servidor principal sin 'use client'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="es">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
          <AuthGuard>
            <ClientLayout>{children}</ClientLayout>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
