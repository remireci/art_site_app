import { URL, LANGUAGES, generateAlternates } from "./sitemap-utils";

export default function sitemap() {
    const staticRoutes = [
        "",
        "/exhibitions",
        "/locations",
        "/advertising",
        "/artist_without_exhibition"
    ];

    return staticRoutes.flatMap(route =>
        LANGUAGES.map(lang => ({
            url: `${URL}/${lang}${route}`,
            lastModified: new Date(),
            alternates: generateAlternates(route),
            priority: route === "" ? 1 : 0.8,
            changeFrequency: "weekly"
        }))
    );
}