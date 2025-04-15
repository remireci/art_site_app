import { getSitemapData, URL, LANGUAGES, generateAlternates } from "./sitemap-utils";

export default async function sitemap() {
  const { cities } = await getSitemapData();

  return cities.flatMap(city => {
    const path = `/exhibitions/cities/${encodeURIComponent(city.city)}`;
    return LANGUAGES.map(lang => ({
      url: `${URL}/${lang}${path}`,
      lastModified: new Date(), // Using current date since we don't have timestamps
      alternates: generateAlternates(path),
      priority: 0.6,
      changeFrequency: "daily"
    }));
  });
}