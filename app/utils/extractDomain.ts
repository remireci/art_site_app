export const extractDomain = (input: unknown): string | null => {
  if (typeof input !== "string") return null;

  // Email case
  if (input.includes("@")) {
    return input.split("@")[1];
  }

  // URL case
  return input
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
};
