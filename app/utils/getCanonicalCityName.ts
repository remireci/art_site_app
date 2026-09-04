export async function getCanonicalCityName(
  slug: string,
  exhibitions: any[],
): Promise<string> {
  // 1. Try finding a clean city string from exhibitions
  const invalidValues = ["N/A", "null", "undefined", "", "-", "Unknown"];
  const validFromExhibition = exhibitions?.find(
    (e) => e.city && !invalidValues.includes(String(e.city).trim()),
  )?.city;

  if (validFromExhibition) return validFromExhibition;

  // 2. Fallback: Format slug ("st-gallen" -> "St. Gallen" or "St Gallen")
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
