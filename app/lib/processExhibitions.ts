import { group } from "console";
import { extractDomain } from "../utils/extractDomain";
import {
  Exhibition,
  Location,
  GroupedExhibition,
  ProcessedData,
} from "../types";

export const processExhibitionsAndLocations = (
  exhibitions: Exhibition[],
  locations: Location[]
): ProcessedData => {
  const processedLocations = locations.filter((location) =>
    exhibitions.some(
      (exhibition) => extractDomain(exhibition.url) === location.domain
    )
  );

  const locationsMap = processedLocations.reduce(
    (map, location) => {
      if (!map[location.domain]) map[location.domain] = [];
      map[location.domain].push(location);
      return map;
    },

    {} as Record<string, Location[]>
  );

  const groupedExhibitions: Record<string, GroupedExhibition> = {};

  for (const exhibition of exhibitions) {
    const domain = extractDomain(exhibition.url);
    if (!domain) {
      console.warn("For this exhibition no url was found", exhibition.title);
      continue;
    }

    const domainLocations = locationsMap[domain] || [];
    const hasMultiLocations = domainLocations.some(
      (loc) => loc.hasMultipleLocations
    );

    const groupKey = hasMultiLocations
      ? `${domain}_${exhibition.location}`
      : domain;

    if (!groupedExhibitions[groupKey]) {
      groupedExhibitions[groupKey] = {
        key: groupKey,
        domain,
        location: exhibition.location || null,
        exhibitions: [],
      };
    }
    groupedExhibitions[groupKey].exhibitions.push(exhibition);
  }

  const uniqueGroups = Object.values(groupedExhibitions).map((group) => {
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
  });

  return {
    processedLocations,
    groupedExhibitions: uniqueGroups,
  };
};
