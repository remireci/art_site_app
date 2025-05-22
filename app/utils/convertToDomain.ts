export const convertToDomain = (urlPart: string): string => {
  const lastHyphenIndex = urlPart.lastIndexOf("-");
  if (lastHyphenIndex === -1) return urlPart; // No hyphens found

  return (
    urlPart.slice(0, lastHyphenIndex) + "." + urlPart.slice(lastHyphenIndex + 1)
  );
};
