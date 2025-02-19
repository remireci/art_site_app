// pages/index.js
import Search from './components/Search.jsx';


const HomePage = async () => {
  // const locations = await getLocations();
  const URL =
    process.env.NODE_ENV === "production"
      ? "https://www.artnowdatabase.eu"
      : "http://localhost:3000";

  const cacheOption = process.env.NODE_ENV === "development"
    ? { cache: 'no-store' }
    : { next: { revalidate: 3600 } }; // Cache for 1 hour in production

  const locationsResponse = await fetch(`${URL}/api/map/locations`, cacheOption);

  const locations = await locationsResponse.json();

  const exhibitionsResponse = await fetch(`${URL}/api/exhibitions`, cacheOption);

  const exhibitions = await exhibitionsResponse.json();

  const filteredExhibitions = exhibitions.filter((exhibition) => exhibition.show !== false);


  return (
    <div>
      <Search
        initialLocations={locations}
        exhibitions={filteredExhibitions}
      />
    </div>
  );
};

export default HomePage;
