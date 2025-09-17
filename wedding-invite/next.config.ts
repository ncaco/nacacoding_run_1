import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // 정적 배포 시 이미지 최적화를 비활성화합니다
    unoptimized: true,
  },
};

export default nextConfig;
