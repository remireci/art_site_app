type Exhibition = {
  _id: string | { toString: () => string };
  domain?: string;
  title?: string;
  location?: string;
  city?: string;
  description?: string;
  artists?: string;
  date_begin_st?: string;
  date_end_st?: string;
  image_reference?: string[];
  exhibition_url?: string;
  url?: string;
  venue_group?: "gallery_art_space" | "museum_institution" | null;
};

export function getDisplayVenueGroup(exhibition: Exhibition) {
  if (exhibition.venue_group) {
    return exhibition.venue_group;
  }

  const locationName = exhibition.location?.toLowerCase() ?? "";

  if (
    locationName.includes("gallery") ||
    locationName.includes("galerie") ||
    locationName.includes("galleria") ||
    locationName.includes("galeria")
  ) {
    return "gallery_art_space";
  }

  return "museum_institution";
}
