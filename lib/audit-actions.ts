"use server";

export type PlaceAuditResult = {
  found: true;
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  reviewCount: number;
  hasWebsite: boolean;
  website: string | null;
  hasPhotos: boolean;
  photoCount: number;
  hasHours: boolean;
  phone: string | null;
  opportunityScore: number;
  opportunityLabel: "Très haute" | "Haute" | "Moyenne" | "Faible";
  opportunityColor: string;
  googleMapsUrl: string;
} | { found: false; error: string };

function calcOpportunity(reviewCount: number, rating: number | null, hasWebsite: boolean, photoCount: number) {
  let score = 0;

  // Reviews (most important factor)
  if (reviewCount < 5)       score += 50;
  else if (reviewCount < 15) score += 38;
  else if (reviewCount < 30) score += 24;
  else if (reviewCount < 60) score += 12;
  else                        score += 4;

  // Rating
  if (rating === null)        score += 20;
  else if (rating < 3.5)     score += 18;
  else if (rating < 4.0)     score += 12;
  else if (rating < 4.3)     score += 6;

  // Website
  if (!hasWebsite)            score += 14;

  // Photos
  if (photoCount < 2)        score += 10;
  else if (photoCount < 5)   score += 6;
  else if (photoCount < 10)  score += 2;

  // Cap at 100
  score = Math.min(score, 100);

  let label: "Très haute" | "Haute" | "Moyenne" | "Faible";
  let color: string;
  if (score >= 75) { label = "Très haute" as const; color = "#E85D2A"; }
  else if (score >= 50) { label = "Haute" as const; color = "#d97706"; }
  else if (score >= 30) { label = "Moyenne" as const; color = "#12382F"; }
  else { label = "Faible" as const; color = "#6b7280"; }

  return { score, label, color };
}

export async function searchBusinessAudit(formData: FormData): Promise<PlaceAuditResult> {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const city         = String(formData.get("city") ?? "").trim();
  const apiKey       = process.env.GOOGLE_PLACES_API_KEY ?? "";

  if (!businessName || !city) {
    return { found: false, error: "Nom et ville requis." };
  }
  if (!apiKey) {
    return { found: false, error: "Clé Google Places API non configurée (GOOGLE_PLACES_API_KEY)." };
  }

  const query = encodeURIComponent(`${businessName} ${city} Suisse`);

  // Step 1: find the place
  const searchRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&language=fr&region=ch&key=${apiKey}`
  );
  const searchData = await searchRes.json() as {
    status: string;
    results: Array<{ place_id: string }>;
  };

  if (searchData.status !== "OK" || !searchData.results?.length) {
    return { found: false, error: "Aucun résultat Google pour ce nom et cette ville." };
  }

  const placeId = searchData.results[0].place_id;

  // Step 2: get details
  const fields = "name,rating,user_ratings_total,photos,website,opening_hours,formatted_phone_number,formatted_address,url";
  const detailRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=fr&key=${apiKey}`
  );
  const detailData = await detailRes.json() as {
    status: string;
    result: {
      name: string;
      formatted_address: string;
      rating?: number;
      user_ratings_total?: number;
      photos?: unknown[];
      website?: string;
      opening_hours?: { weekday_text?: string[] };
      formatted_phone_number?: string;
      url?: string;
    };
  };

  if (detailData.status !== "OK") {
    return { found: false, error: "Impossible de récupérer les détails Google." };
  }

  const r = detailData.result;
  const reviewCount = r.user_ratings_total ?? 0;
  const rating = r.rating ?? null;
  const photoCount = r.photos?.length ?? 0;
  const hasWebsite = !!r.website;
  const hasHours = !!(r.opening_hours?.weekday_text?.length);

  const { score, label, color } = calcOpportunity(reviewCount, rating, hasWebsite, photoCount);

  return {
    found: true,
    placeId,
    name: r.name,
    address: r.formatted_address,
    rating,
    reviewCount,
    hasWebsite,
    website: r.website ?? null,
    hasPhotos: photoCount > 0,
    photoCount,
    hasHours,
    phone: r.formatted_phone_number ?? null,
    opportunityScore: score,
    opportunityLabel: label,
    opportunityColor: color,
    googleMapsUrl: r.url ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
  };
}
