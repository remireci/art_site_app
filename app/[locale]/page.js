import Search from "../components/Search";

export const runtime = 'edge';

export default async function HomePage() {

  const URL =
    process.env.NODE_ENV === "production"
      ? "https://www.artnowdatabase.eu"
      : "http://localhost:3000";

  try {
    const cacheOption =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 3600 } };

    const locationsResponse = await fetch(`${URL}/api/map/locations`, cacheOption);
    const exhibitionsResponse = await fetch(`${URL}/api/exhibitions`, cacheOption);

    if (!locationsResponse.ok || !exhibitionsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const locations = await locationsResponse.json();
    const exhibitions = await exhibitionsResponse.json();

    // console.log("Sample locations data:", exhibitions.slice(0, 10));

    const extractWords = (title) =>
      title
        .toLowerCase()
        .split(/\s+/) // Split by whitespace
        .filter((word) => word.length >= 4); // Keep words with at least 4 characters

    // Extract domain from URL
    function extractDomain(url) {
      // Remove protocol (http:// or https://) and www.
      const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return domain;
    }

    const filteredLocations = locations.filter((location) =>
      exhibitions.some((exhibition) => extractDomain(exhibition.url) === location.domain)
    );

    const locationsMap = filteredLocations.reduce((map, location) => {
      // Store array of locations per domain for multi-location case
      if (!map[location.domain]) map[location.domain] = [];
      map[location.domain].push(location);
      return map;
    }, {});

    const groupedExhibitions = {};

    for (const exhibition of exhibitions) {
      const domain = extractDomain(exhibition.url);
      if (!domain) continue;

      // Get all locations for this domain
      const domainLocations = locationsMap[domain] || [];

      // Check if any location is marked as multi-location
      const hasMultiLocations = domainLocations.some(loc => loc.hasMultipleLocations);

      // Create the group key
      const groupKey = hasMultiLocations
        ? `${domain}_${exhibition.location}`
        : domain;

      // Initialize the group if it doesn't exist
      if (!groupedExhibitions[groupKey]) {
        groupedExhibitions[groupKey] = {
          key: groupKey,
          domain,
          location: exhibition.location,
          exhibitions: []  // This will directly contain the array
        };
      }
      // Push the exhibition directly into the array
      groupedExhibitions[groupKey].exhibitions.push(exhibition);
    }

    const uniqueGroups = Object.values(groupedExhibitions).map(group => {
      const titleMap = {};
      return {
        ...group,
        exhibitions: group.exhibitions.filter(exhibition => {
          const normalizedTitle = exhibition.title.toLowerCase().trim();
          if (!titleMap[normalizedTitle]) {
            titleMap[normalizedTitle] = true;
            return true;
          }
          return false;
        })
      };
    });


    // // Now you can get your unique exhibitions if needed
    // const uniqueExhibitions = uniqueGroups.flatMap(group => group.exhibitions);

    // // Filter for SMB museum
    // const smbGroups = uniqueGroups.filter(group => group.domain === 'eenwerk.nl');


    // console.log("cached or not?", smbGroups);

    return (
      <div>
        <Search initialLocations={filteredLocations} exhibitions={uniqueGroups} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
