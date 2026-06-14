import { NextRequest, NextResponse } from "next/server";

interface GooglePlaceResult {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  website?: string;
  formatted_phone_number?: string;
  photos?: unknown[];
  opening_hours?: unknown;
  formatted_address?: string;
}

interface GooglePlaceDetailsResponse {
  status: string;
  result?: GooglePlaceResult;
}

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId")?.trim() ?? "";
  const apiKey = process.env.GOOGLE_PLACES_API_KEY ?? "";
  if (!placeId || !apiKey) return NextResponse.json(null);

  try {
    const fields = [
      "name",
      "rating",
      "user_ratings_total",
      "website",
      "formatted_phone_number",
      "photos",
      "opening_hours",
      "formatted_address",
    ].join(",");

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=fr&key=${apiKey}`
    );
    const data = (await res.json()) as GooglePlaceDetailsResponse;
    if (data.status !== "OK" || !data.result) return NextResponse.json(null);

    const r = data.result;
    return NextResponse.json({
      name: r.name ?? "",
      rating: r.rating ?? 0,
      reviewCount: r.user_ratings_total ?? 0,
      website: r.website ?? null,
      phone: r.formatted_phone_number ?? null,
      photoCount: r.photos?.length ?? 0,
      hasHours: !!r.opening_hours,
      address: r.formatted_address ?? "",
    });
  } catch {
    return NextResponse.json(null);
  }
}
