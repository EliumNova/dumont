/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite probar la app desde otros dispositivos de la red local (tablet
  // física, celular) accediendo por la IP de esta compu en vez de
  // "localhost". Se define con ALLOWED_DEV_ORIGINS (hosts separados por comas,
  // sin protocolo ni puerto), ej: "192.168.0.15,172.30.240.1".
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ...(process.env.ALLOWED_DEV_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        //url de back en .env
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
