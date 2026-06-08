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
};

export default nextConfig;
