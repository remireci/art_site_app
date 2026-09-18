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

export function interleaveByVenue(exhibitions: Exhibition[]) {
  const groups = new Map<string, Exhibition[]>();

  for (const exhibition of exhibitions) {
    const venue = exhibition.location?.trim() || "Unknown venue";

    if (!groups.has(venue)) {
      groups.set(venue, []);
    }

    groups.get(venue)!.push(exhibition);
  }

  const venueGroups = Array.from(groups.values());

  const result: Exhibition[] = [];
  let index = 0;

  while (venueGroups.some((group) => index < group.length)) {
    for (const group of venueGroups) {
      if (group[index]) {
        result.push(group[index]);
      }
    }

    index++;
  }

  return result;
}
