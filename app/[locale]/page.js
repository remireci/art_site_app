import Search from "../components/Search";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

export default async function HomePage() {
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

    // console.log("Sample locations data:", locations.slice(0, 10));

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

    // Step 1: Group exhibitions by domain and date_end_st
    const groupedExhibitions = exhibitions.reduce((acc, exhibition) => {
      const domain = extractDomain(exhibition.url);
      const key = `${domain}_${exhibition.date_end_st}`; // Unique group key

      if (!acc[key]) acc[key] = [];
      acc[key].push(exhibition);

      return acc;
    }, {});

    // Step 2: Within each group, filter out duplicates
    const uniqueExhibitions = Object.values(groupedExhibitions).flatMap((group) => {
      const filteredGroup = [];

      group.forEach((exhibition) => {
        const titleWords = new Set(extractWords(exhibition.title));

        // Check if an exhibition in filteredGroup already exists with at least one common word
        const isDuplicate = filteredGroup.some((existing) => {
          const existingWords = new Set(extractWords(existing.title));
          return [...titleWords].some((word) => existingWords.has(word)); // Check for common words
        });

        if (!isDuplicate) filteredGroup.push(exhibition);
      });

      return filteredGroup;
    });

    // // Step 1: Count unique exhibitions per domain
    // const domainCounts = uniqueExhibitions.reduce((acc, exhibition) => {
    //   const domain = extractDomain(exhibition.url);

    //   // If domain exists, increment its count in the accumulator
    //   if (domain) {
    //     acc[domain] = (acc[domain] || 0) + 1;
    //   }
    //   return acc;
    // }, {});

    // // Step 2: Log the number of exhibitions per domain
    // // console.log("Exhibitions per domain:", domainCounts);

    // const exhibitionsWithSyntactic = uniqueExhibitions.filter(exhibition =>
    //   exhibition.title && exhibition.title.toLowerCase().includes("syntactic")
    // );

    // console.log("Exhibitions with 'syntactic' in the title:", exhibitionsWithSyntactic);

    return (
      <div>
        <Search initialLocations={locations} exhibitions={uniqueExhibitions} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
