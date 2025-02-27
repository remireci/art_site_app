import { getLocations, getExhibitionsByDomain } from "../../db/mongo";
import fs from "fs";
import path from "path";

const URL =
    process.env.NODE_ENV === "production"
        ? "https://www.artnowdatabase.eu"
        : "http://localhost:3000";

const sitemapCachePath = path.join(process.cwd(), "public", "sitemap.xml");

export async function GET(req) {
    try {
        const locationsData = await getLocations();
        const locationsWithExhibitions = [];

        for (const location of locationsData) {
            const exhibitions = await getExhibitionsByDomain(location.domain);

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
            "/texts",
        ].map((route) => ({
            url: `${URL}${route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 1,
        }));

        const sitemapXml = generateSitemapXml([...routes, ...locationsWithExhibitions]);

        // Write to the sitemap file in the public folder
        fs.writeFileSync(sitemapCachePath, sitemapXml);
        return new Response("Sitemap generated successfully", { status: 200 });
    } catch (error) {
        console.error("Error generating sitemap:", error.message);
        return new Response("Error generating sitemap", { status: 500 });
    }
}

function generateSitemapXml(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
            .map(
                (url) => `
        <url>
            <loc>${url.url}</loc>
            <lastmod>${url.lastModified}</lastmod>
            <changefreq>${url.changeFrequency}</changefreq>
            <priority>${url.priority}</priority>
        </url>`
            )
            .join("")}
    </urlset>`;
}
