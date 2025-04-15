import { URL } from "./sitemap-utils";

export default function sitemap() {
  return [
    {
      url: `${URL}/sitemap-pages.xml`,
      lastModified: new Date()
    },
    {
      url: `${URL}/sitemap-locations.xml`,
      lastModified: new Date()
    },
    {
      url: `${URL}/sitemap-cities.xml`,
      lastModified: new Date()
    }
  ];
}