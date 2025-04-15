import { getSitemapData, URL, LANGUAGES, generateAlternates } from "./sitemap-utils";

export default async function sitemap() {
    const { locations } = await getSitemapData();

    return locations.flatMap(location => {
        const path = `/exhibitions/locations/${encodeURIComponent(location.domain)}`;
        return LANGUAGES.map(lang => ({
            url: `${URL}/${lang}${path}`,
            lastModified: new Date(), // Using current date since we don't have timestamps
            alternates: generateAlternates(path),
            priority: 0.7,
            changeFrequency: "daily"
        }));
    });
}