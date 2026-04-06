const R2_BASE = "https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev";

export function getSitemapImageUrl(image: string): string | null {
  if (!image || typeof image !== "string") return null;

  // Already absolute URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image.split("?")[0];
  }

  // Stored as "agenda/2026/04/file.jpg"
  if (image.startsWith("agenda/")) {
    return `${R2_BASE}/${image}`.split("?")[0];
  }

  // Stored as "2026/04/file.jpg"
  return `${R2_BASE}/agenda/${image}`.split("?")[0];
}
