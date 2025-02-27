import Search from "./components/Search";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

export default async function HomePage() {
  try {
    const cacheOption =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" } // Disable caching in development
        : { next: { revalidate: 3600 } }; // Cache for 1 hour in production

    const locationsResponse = await fetch(`${URL}/api/map/locations`, cacheOption);
    const exhibitionsResponse = await fetch(`${URL}/api/exhibitions`, cacheOption);


    if (!locationsResponse.ok || !exhibitionsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const locations = await locationsResponse.json();
    const exhibitions = await exhibitionsResponse.json();

    console.log("Sample locations data:", locations.slice(0, 10));


    return (
      <div>
        <Search initialLocations={locations} exhibitions={exhibitions} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
