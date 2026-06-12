import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // разрешаем next/image грузить фото товаров из Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fzqwxnphfrbzaxvsnyzz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // безопасные заголовки (без CSP, чтобы ничего не сломать)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
