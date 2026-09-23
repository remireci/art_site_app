import { extractDomain } from "@/utils/extractDomain";

export type MapLocation = {
  latitude: number;
  longitude: number;
  domain: string;
  name: string;
  domain_slug: string;
  hasMultipleLocations?: boolean;
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

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

export async function getMapData() {
  const cacheOption =
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" as const }
      : { next: { revalidate: 3600 } };

  const [locationsResponse, exhibitionsResponse] = await Promise.all([
    fetch(`${BASE_URL}/api/map/locations`, cacheOption),
    fetch(`${BASE_URL}/api/exhibitions`, cacheOption),
  ]);

  if (!locationsResponse.ok || !exhibitionsResponse.ok) {
    throw new Error("Failed to fetch map data");
  }

  const locations: MapLocation[] = await locationsResponse.json();
  const exhibitions: MapExhibition[] = await exhibitionsResponse.json();

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
