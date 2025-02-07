import { getLocations } from "../app/db/mongo";

// @TODO add domain conditionaly
const URL =
    process.env.NODE_ENV === "production"
        ? "https://www.artnowdatabase.eu"
        : "http://localhost:3000";

export default async function sitemap() {
    try {
        const locationsData = await getLocations();

        const locations = locationsData.map((location) => ({
            url: `${URL}/locations/${location.domain}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        const routes = [
            "",
            "/exhibitions",
            "/locations",
            "/advertising",
            "/artist_without_exhibition"
        ].map((route) => ({
            url: `${URL}${route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 1,
        }));

        return [...routes, ...locations];
    } catch (error) {
        console.error("Error generating sitemap:", error.message);
        return [];
    }
}
