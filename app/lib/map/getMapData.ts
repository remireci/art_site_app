import { extractDomain } from "@/utils/extractDomain";
import { getLocations, getAgendaItems } from "@/db/mongo";
import { getPublicExhibitionFilter } from "@/lib/map/getPublicExhibitionFilter";

export type MapLocation = {
  latitude: number;
  longitude: number;
  domain: string;
  name: string;
  domain_slug: string;
  hasMultipleLocations?: boolean;
  venue_group?: "museum_institution" | "gallery_art_space";
};

export type MapExhibition = {
  _id: string;
  title: string;
  date_end?: string;
  location: string;
  url: string;
  exh_url?: string;
  artists?: string;
  date_end_st: string;
  image_reference: string[];
  exhibition_url: string;
};

export type ExhibitionGroup = {
  key: string;
  domain: string;
  location: string | null;
  exhibitions: MapExhibition[];
};

export async function getMapData() {
  const [locationDocs, exhibitionDocs] = await Promise.all([
    getLocations({ onlyWithExhibitions: true }),
    getAgendaItems(getPublicExhibitionFilter(), {
      title: 1,
      location: 1,
      url: 1,
      image_reference: 1,
    }),
  ]);

  if (!Array.isArray(locationDocs) || !Array.isArray(exhibitionDocs)) {
    throw new Error("Failed to load map data from MongoDB");
  }

  // Preserve the output of /api/map/locations:
  // - exclude locations named "N/A"
  // - remove MongoDB _id
  // - convert values into plain JSON data
  const locations: MapLocation[] = JSON.parse(
    JSON.stringify(
      locationDocs
        .filter((location) => location.name !== "N/A")
        .map(({ _id, ...location }) => location),
    ),
  );

  // Preserve the JSON serialization previously performed
  // by NextResponse.json() and response.json().
  const sourceExhibitions: MapExhibition[] = JSON.parse(
    JSON.stringify(exhibitionDocs),
  );

  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const exhibitions: MapExhibition[] = sourceExhibitions.filter(
    (exhibition) => exhibition.date_end_st >= today,
  );

  const filteredLocations = locations.filter((location) =>
    exhibitions.some(
      (exhibition) => extractDomain(exhibition.url) === location.domain,
    ),
  );

  const locationsMap = filteredLocations.reduce<Record<string, MapLocation[]>>(
    (map, location) => {
      if (!map[location.domain]) {
        map[location.domain] = [];
      }

      map[location.domain].push(location);

      return map;
    },
    {},
  );

  const groupedExhibitions: Record<string, ExhibitionGroup> = {};

  for (const exhibition of exhibitions) {
    const domain = extractDomain(exhibition.url);

    if (!domain) continue;

    const domainLocations = locationsMap[domain] || [];

    const hasMultiLocations = domainLocations.some(
      (location) => location.hasMultipleLocations,
    );

    const groupKey = hasMultiLocations
      ? `${domain}_${exhibition.location}`
      : domain;

    if (!groupedExhibitions[groupKey]) {
      groupedExhibitions[groupKey] = {
        key: groupKey,
        domain,
        location: exhibition.location,
        exhibitions: [],
      };
    }

    groupedExhibitions[groupKey].exhibitions.push(exhibition);
  }

  const uniqueGroups: ExhibitionGroup[] = Object.values(groupedExhibitions).map(
    (group) => {
      const titleMap: Record<string, boolean> = {};

      return {
        ...group,
        exhibitions: group.exhibitions.filter((exhibition) => {
          const normalizedTitle = exhibition.title.toLowerCase().trim();

          if (!titleMap[normalizedTitle]) {
            titleMap[normalizedTitle] = true;
            return true;
          }

          return false;
        }),
      };
    },
  );

  return {
    locations: filteredLocations,
    exhibitions: uniqueGroups,
    rawExhibitions: exhibitions,
  };
}
