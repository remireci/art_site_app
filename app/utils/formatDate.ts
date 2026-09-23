export const formatDate = (
  dateString: string,
  locale: string = "en",
) => {
  if (!dateString) return "";

  const localeMap: Record<string, string> = {
    en: "en-GB",
    nl: "nl-BE",
    fr: "fr-BE",
  };

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return "";

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat(localeMap[locale] || "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};