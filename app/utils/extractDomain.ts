export const extractDomain = (url: string) => {
  const domain = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
  return domain;
};
