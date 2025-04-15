// DEPRECATED: Transitioning to Next.js native sitemap
// Remove after 2024-01-01 if new sitemap works correctly

import { getLocations, getCities } from "../app/db/mongo";
import fs from 'fs';
import path from 'path';

const URL =
    process.env.NODE_ENV === "production"
        ? "https://www.artnowdatabase.eu"
        : "http://localhost:3000";

const LANGUAGES = ["en", "nl", "fr"];

const sitemapCachePath = path.join(process.cwd(), 'public', 'sitemap.xml');
const masterSitemapCachePath = path.join(process.cwd(), 'public', 'sitemap-index.xml'); // Master sitemap path

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
        const citiesData = await getCities();

        // Function to generate localized URLs for each language
        const generateLocalizedUrls = (path) => {
            return LANGUAGES.map((lang) => ({
                loc: `${URL}/${lang}${path}`,
                hreflang: lang,
            }));
        };

        // Generate sitemap for each language
        const generateSitemapForLanguage = (lang) => {
            const locationsWithExhibitions = locationsData.flatMap(location => {
                const basePath = `/exhibitions/locations/${encodeURIComponent(location.domain)}`;
                return {
                    url: `${URL}/${lang}${basePath}`, // Default version
                    lastModified: new Date().toISOString(),
                    changeFrequency: "weekly",
                    priority: 0.8,
                    alternates: generateLocalizedUrls(basePath),
                };
            });

            const citiesWithExhibitions = citiesData.flatMap(city => {
                const basePath = `/exhibitions/cities/${encodeURIComponent(city.city)}`;
                return {
                    url: `${URL}/${lang}${basePath}`, // Default version
                    lastModified: new Date().toISOString(),
                    changeFrequency: "weekly",
                    priority: 0.8,
                    alternates: generateLocalizedUrls(basePath),
                };
            });

            const routes = [
                "",
                "/exhibitions",
                "/locations",
                "/advertising",
                "/artist_without_exhibition",
            ].flatMap((route) => {
                return {
                    url: `${URL}/${lang}${route}`,
                    lastModified: new Date().toISOString(),
                    changeFrequency: "weekly",
                    priority: 1,
                    alternates: generateLocalizedUrls(route),
                };
            });

            const sitemapEntries = [...routes, ...locationsWithExhibitions, ...citiesWithExhibitions];
            console.log("Sample sitemap entry:", sitemapEntries[0]);
            return generateSitemapXml(sitemapEntries);
        };

        // Generate sitemaps for each language
        const sitemaps = await Promise.all(LANGUAGES.map((lang) => {
            const sitemapXml = generateSitemapForLanguage(lang);
            const sitemapPath = path.join(process.cwd(), 'public', `sitemap_${lang}.xml`);
            fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
            return sitemapPath;
        }));

        // Create a master sitemap that lists all language-specific sitemaps
        const sitemapIndexXml = generateSitemapIndexXml(sitemaps);
        fs.writeFileSync(masterSitemapCachePath, sitemapIndexXml, 'utf-8');

        return sitemapIndexXml; // Return master sitemap

    } catch (error) {
        console.error("Error generating sitemap:", error.message);
        return [];
    }
}

function generateSitemapXml(entries) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${entries.map(entry => `
    <url>
        <loc>${entry.url}</loc>
        <lastmod>${entry.lastModified}</lastmod>
        <changefreq>${entry.changeFrequency}</changefreq>
        <priority>${entry.priority}</priority>
        ${Array.isArray(entry.alternates)
            ? entry.alternates.map(alt => `
                <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.loc}"/>
              `).join("")
            : ""
        }
    </url>`).join("")}
</urlset>`;
}

function generateSitemapIndexXml(sitemaps) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps.map(sitemap => `
    <sitemap>
        <loc>${URL}/${path.basename(sitemap)}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`).join("")}
</sitemapindex>`;
}


// import { getLocations, getCities } from "../app/db/mongo";
// import fs from 'fs';
// import path from 'path';

// // @TODO add domain conditionaly
// const URL =
//     process.env.NODE_ENV === "production"
//         ? "https://www.artnowdatabase.eu"
//         : "http://localhost:3000";

// const LANGUAGES = ["en", "nl", "fr"];

// const sitemapCachePath = path.join(process.cwd(), 'public', 'sitemap.xml');

// export default async function sitemap() {
//     try {
//         const cacheDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
//         const currentTime = Date.now();

//         // Check if cached sitemap exists and is fresh
//         if (fs.existsSync(sitemapCachePath)) {
//             const stats = fs.statSync(sitemapCachePath);
//             const lastModifiedTime = stats.mtimeMs;
//             if (currentTime - lastModifiedTime < cacheDuration) {
//                 // If cached sitemap is fresh, return it directly
//                 const sitemapXml = fs.readFileSync(sitemapCachePath, 'utf-8');
//                 return sitemapXml;
//             }
//         }

//         const locationsData = await getLocations();

//         const generateLocalizedUrls = (path) => {
//             return LANGUAGES.map((lang) => ({
//                 loc: `${URL}/${lang}${path}`,
//                 hreflang: lang,
//             }));
//         };

//         const locationsWithExhibitions = locationsData.flatMap(location => {
//             const basePath = `/exhibitions/locations/${encodeURIComponent(location.domain)}`;
//             return {
//                 url: `${URL}/en${basePath}`, // Default version
//                 lastModified: new Date().toISOString(),
//                 changeFrequency: "weekly",
//                 priority: 0.8,
//                 alternates: generateLocalizedUrls(basePath),
//             };
//         });

//         const citiesData = await getCities();

//         const citiesWithExhibitions = citiesData.flatMap(city => {
//             const basePath = `/exhibitions/cities/${encodeURIComponent(city.city)}`;
//             return {
//                 url: `${URL}/en${basePath}`, // Default version
//                 lastModified: new Date().toISOString(),
//                 changeFrequency: "weekly",
//                 priority: 0.8,
//                 alternates: generateLocalizedUrls(basePath),
//             };
//         });

//         const routes = [
//             "",
//             "/exhibitions",
//             "/locations",
//             "/advertising",
//             "/artist_without_exhibition",
//             // "/texts"
//         ].flatMap((route) => {
//             return {
//                 url: `${URL}/en${route}`,
//                 lastModified: new Date().toISOString(),
//                 changeFrequency: "weekly",
//                 priority: 1,
//                 alternates: generateLocalizedUrls(route),
//             };
//         });
//         const sitemapEntries = [...routes, ...locationsWithExhibitions, ...citiesWithExhibitions];

//         const sitemapXml = generateSitemapXml(sitemapEntries);

//         fs.writeFileSync(sitemapCachePath, sitemapXml, 'utf-8');

//         return sitemapXml;

//     } catch (error) {
//         console.error("Error generating sitemap:", error.message);
//         return [];
//     }
// }

// function generateSitemapXml(entries) {
//     return `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
//     xmlns:xhtml="http://www.w3.org/1999/xhtml">
//     ${entries.map(entry => `
//     <url>
//         <loc>${entry.url}</loc>
//         <lastmod>${entry.lastModified}</lastmod>
//         <changefreq>${entry.changeFrequency}</changefreq>
//         <priority>${entry.priority}</priority>
//         ${entry.alternates.map(alt => `
//         <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.loc}"/>
//         `).join("")}
//     </url>`).join("")}
// </urlset>`;
// }