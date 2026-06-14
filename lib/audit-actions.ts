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
  opportunityLabel: "Tres haute" | "Haute" | "Moyenne" | "Faible";
  opportunityColor: string;
  googleMapsUrl: string;
} | { found: false; error: string };

function calcOpportunity(reviewCount: number, rating: number | null, hasWebsite: boolean, photoCount: number) {
  let score = 0;
  if (reviewCount < 5)       score += 50;
  else if (reviewCount < 15) score += 38;
  else if (reviewCount < 30) score += 24;
  else if (reviewCount < 60) score += 12;
  else                        score += 4;

  if (rating === null)        score += 20;
  else if (rating < 3.5)     score += 18;
  else if (rating < 4.0)     score += 12;
  else if (rating < 4.3)     score += 6;

  if (!hasWebsite)            score += 14;

  if (photoCount < 2)        score += 10;
  else if (photoCount < 5)   score += 6;
  else if (photoCount < 10)  score += 2;

  score = Math.min(score, 100);

  let label: "Tres haute" | "Haute" | "Moyenne" | "Faible";
  let color: string;
  if (score >= 75) { label = "Tres haute"; color = "#E85D2A"; }
  else if (score >= 50) { label = "Haute"; color = "#d97706"; }
  else if (score >= 30) { label = "Moyenne"; color = "#12382F"; }
  else { label = "Faible"; color = "#6b7280"; }

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
    return { found: false, error: "Cle Google Places API non configuree (GOOGLE_PLACES_API_KEY)." };
  }

  // Without "Suisse" — region=ch already scopes results to Switzerland
  const query = encodeURIComponent(`${businessName} ${city}`);

  let searchData: { status: string; results: Array<{ place_id: string }> };
  try {
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&language=fr&region=ch&key=${apiKey}`
    );
    searchData = (await searchRes.json()) as typeof searchData;
  } catch (err) {
    return { found: false, error: `Erreur reseau Google Places: ${String(err)}` };
  }

  if (searchData.status === "REQUEST_DENIED") {
    return { found: false, error: "Cle API Google refusee (REQUEST_DENIED). Verifiez les restrictions dans Google Cloud Console — supprimez la restriction HTTP referer si elle existe." };
  }
  if (searchData.status === "OVER_QUERY_LIMIT") {
    return { found: false, error: "Quota Google Places depasse. Reessayez dans quelques minutes." };
  }
  if (searchData.status !== "OK" || !searchData.results?.length) {
    return { found: false, error: `Aucun resultat pour "${businessName}" a ${city} (status Google: ${searchData.status}). Essayez un nom plus court ou verifiez l'orthographe.` };
  }

  const placeId = searchData.results[0].place_id;
  const fields = "name,rating,user_ratings_total,photos,website,opening_hours,formatted_phone_number,formatted_address,url";

  let detailData: {
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
  try {
    const detailRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=fr&key=${apiKey}`
    );
    detailData = (await detailRes.json()) as typeof detailData;
  } catch (err) {
    return { found: false, error: `Erreur reseau details: ${String(err)}` };
  }

  if (detailData.status !== "OK") {
    return { found: false, error: `Impossible de recuperer les details (status: ${detailData.status}).` };
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
