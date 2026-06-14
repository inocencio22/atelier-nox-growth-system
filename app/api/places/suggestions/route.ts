import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q    = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const city = (req.nextUrl.searchParams.get("city") ?? "").trim();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY ?? "";

  if (q.length < 2 || !apiKey) {
    return NextResponse.json([]);
  }

  const input = encodeURIComponent(city ? `${q} ${city}` : q);
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=establishment&language=fr&components=country:ch&key=${apiKey}`
    );
    const data = (await res.json()) as {
      status: string;
      predictions?: Array<{ description: string; place_id: string }>;
    };

    if (data.status !== "OK" || !data.predictions?.length) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      data.predictions.slice(0, 6).map((p) => ({
        description: p.description,
        placeId: p.place_id,
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
