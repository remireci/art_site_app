import { getLocations, getCities } from "@/app/db/mongo";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://www.artnowdatabase.eu"
    : "http://localhost:3000";

const LANGUAGES = ["en", "nl", "fr"];

export default async function sitemap() {
  try {
    const [locationsData, citiesData] = await Promise.all([
      getLocations(),
      getCities(),
    ]);

    // Generate all URLs
    const entries = [
      // Static routes
      ...[
        "",
        "/exhibitions",
        "/locations",
        "/advertising",
        "/artist_without_exhibition",
      ].flatMap((route) =>
        LANGUAGES.map((lang) => ({
          url: `${URL}/${lang}${route}`,
          lastModified: new Date(),
          alternates: {
            languages: Object.fromEntries(
              LANGUAGES.map((l) => [l, `${URL}/${l}${route}`])
            ),
          },
        }))
      ),

      // Location pages
      ...locationsData.flatMap((location) =>
        LANGUAGES.map((lang) => ({
          url: `${URL}/${lang}/exhibitions/locations/${encodeURIComponent(
            location.domain
          )}`,
          lastModified: new Date(),
          alternates: {
            languages: Object.fromEntries(
              LANGUAGES.map((l) => [
                l,
                `${URL}/${l}/exhibitions/locations/${encodeURIComponent(
                  location.domain
                )}`,
              ])
            ),
          },
        }))
      ),

      // City pages
      ...citiesData.flatMap((city) =>
        LANGUAGES.map((lang) => ({
          url: `${URL}/${lang}/exhibitions/cities/${encodeURIComponent(
            city.city
          )}`,
          lastModified: new Date(),
          alternates: {
            languages: Object.fromEntries(
              LANGUAGES.map((l) => [
                l,
                `${URL}/${l}/exhibitions/cities/${encodeURIComponent(
                  city.city
                )}`,
              ])
            ),
          },
        }))
      ),
    ];

    return entries;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Fallback to minimal sitemap
    return [
      {
        url: URL,
        lastModified: new Date(),
      },
    ];
  }
}
