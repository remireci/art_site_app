import Search from "./components/Search";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

export default async function HomePage() {
  try {
    const locationsResponse = await fetch(`${URL}/api/map/locations`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const exhibitionsResponse = await fetch(`${URL}/api/exhibitions`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!locationsResponse.ok || !exhibitionsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const locations = await locationsResponse.json();
    const exhibitions = await exhibitionsResponse.json();
    const filteredExhibitions = exhibitions.filter((ex) => ex.show !== false);

    return (
      <div>
        <Search initialLocations={locations} exhibitions={filteredExhibitions} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
