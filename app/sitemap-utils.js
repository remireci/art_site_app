import { getLocations, getCities } from "@/app/db/mongo";

const URL = process.env.NODE_ENV === "production"
  ? "https://www.artnowdatabase.eu"
  : "http://localhost:3000";

const LANGUAGES = ["en", "nl", "fr"];

export function generateAlternates(path) {
  const alternates = {};
  LANGUAGES.forEach(lang => {
    alternates[lang] = `${URL}/${lang}${path}`;
  });
  return { languages: alternates };
}

export async function getSitemapData() {
  try {
    const [locations, cities] = await Promise.all([
      getLocations(),
      getCities()
    ]);
    return { locations, cities };
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    return { locations: [], cities: [] };
  }
}