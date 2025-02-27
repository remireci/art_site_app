import { getLocations, getExhibitionsByDomain } from "../app/db/mongo";
import fs from 'fs';
import path from 'path';

// @TODO add domain conditionaly
const URL =
    process.env.NODE_ENV === "production"
        ? "https://www.artnowdatabase.eu"
        : "http://localhost:3000";

const sitemapCachePath = path.join(process.cwd(), 'public', 'sitemap.xml');

export default async function sitemap() {
    try {

        const cacheDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        const currentTime = Date.now();

        // Check if cached sitemap exists and is fresh
        if (fs.existsSync(sitemapCachePath)) {
            const stats = fs.statSync(sitemapCachePath);
            const lastModifiedTime = stats.mtimeMs;

            if (currentTime - lastModifiedTime < cacheDuration) {
                // If cached sitemap is fresh, return it directly
                const sitemapXml = fs.readFileSync(sitemapCachePath, 'utf-8');
                return sitemapXml;
            }
        }

        const locationsData = await getLocations();

        const locationsWithExhibitions = [];

        for (const location of locationsData) {
            const exhibitions = await getExhibitionsByDomain(location.domain);
            console.log(exhibitions);

            // If there's at least one exhibition for this location, include it in the sitemap
            if (exhibitions.length > 0) {
                const encodedDomain = encodeURIComponent(location.domain);
                locationsWithExhibitions.push({
                    url: `${URL}/locations/${encodedDomain}`,
                    lastModified: new Date().toISOString(),
                    changeFrequency: "weekly",
                    priority: 0.8,
                });
            }
        }

        const routes = [
            "",
            "/exhibitions",
            "/locations",
            "/advertising",
            "/artist_without_exhibition",
            "/texts"
        ].map((route) => ({
            url: `${URL}${route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 1,
        }));

        return [...routes, ...locationsWithExhibitions];
    } catch (error) {
        console.error("Error generating sitemap:", error.message);
        return [];
    }
}
