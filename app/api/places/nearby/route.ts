import { NextRequest, NextResponse } from "next/server";

interface GoogleLocation {
  lat: number;
  lng: number;
}

interface GoogleDetailsResponse {
  status: string;
  result?: { geometry: { location: GoogleLocation } };
}

interface GoogleNearbyResult {
  place_id: string;
  name?: string;
  rating?: number;
  user_ratings_total?: number;
}

interface GoogleNearbyResponse {
  status: string;
  results?: GoogleNearbyResult[];
}

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId")?.trim() ?? "";
  const apiKey = process.env.GOOGLE_PLACES_API_KEY ?? "";
  if (!placeId || !apiKey) return NextResponse.json([]);

  try {
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`
    );
    const detailsData = (await detailsRes.json()) as GoogleDetailsResponse;
    if (detailsData.status !== "OK" || !detailsData.result) return NextResponse.json([]);

    const { lat, lng } = detailsData.result.geometry.location;

    const nearbyRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=hair_care&language=fr&key=${apiKey}`
    );
    const nearbyData = (await nearbyRes.json()) as GoogleNearbyResponse;
    if (nearbyData.status !== "OK" || !nearbyData.results) return NextResponse.json([]);

    const competitors = nearbyData.results
      .filter((p) => p.place_id !== placeId && (p.rating ?? 0) > 0)
      .sort((a, b) => (b.user_ratings_total ?? 0) - (a.user_ratings_total ?? 0))
      .slice(0, 3)
      .map((p) => ({
        name: p.name ?? "",
        rating: p.rating ?? 0,
        reviewCount: p.user_ratings_total ?? 0,
      }));

    return NextResponse.json(competitors);
  } catch {
    return NextResponse.json([]);
  }
}
