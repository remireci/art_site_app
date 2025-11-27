export const getOptimizedSrc = (imagePath: string | undefined) => {
  if (imagePath) {
    return imagePath; // Use your own pre-optimized R2 file
  }
  return "https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev/byArtNowDatabase_placeholder.png";
};
