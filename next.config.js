/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "transmeralda.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Configuraciones adicionales para mejorar el rendimiento
    minimumCacheTTL: 300, // Cache por 5 minutos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"], // Usar WebP cuando sea posible
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Configuraciones adicionales para manejar timeouts
  experimental: {
    // Aumentar el timeout para imágenes
    proxyTimeout: 30000, // 30 segundos
  },
  // Configurar headers para mejorar el cache
  async headers() {
    return [
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
