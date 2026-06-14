import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  typescript: {
    // Types for invoices table pending SQL migration in Supabase dashboard
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
