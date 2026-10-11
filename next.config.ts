import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 自有服务器 Docker 部署时使用 standalone 输出（Vercel 不受影响）
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
};

export default nextConfig;
