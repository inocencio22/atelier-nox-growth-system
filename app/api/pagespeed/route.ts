import { NextRequest, NextResponse } from "next/server";

interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number };
    };
  };
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!url) return NextResponse.json(null);

  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`
    );
    if (!res.ok) return NextResponse.json(null);
    const data = (await res.json()) as PageSpeedResponse;
    const score = Math.round(
      (data.lighthouseResult?.categories?.performance?.score ?? 0) * 100
    );
    return NextResponse.json({ score });
  } catch {
    return NextResponse.json(null);
  }
}
