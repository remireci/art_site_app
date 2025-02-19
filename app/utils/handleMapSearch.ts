import L from "leaflet";

interface GeocodeResult {
  center: { lat: number; lng: number };
  name: string;
}

export const handleMapSearch = async (
  searchQuery: string,
  setCoord: (coord: [number, number]) => void,
  setLocationMarkers: (
    markers: { lat: number; lon: number; address: string }[]
  ) => void
) => {
  if (!searchQuery) return;

  try {
    const geocoder = (L.Control as any).Geocoder.nominatim();
    const results: GeocodeResult[] = await geocoder.geocode(searchQuery);

    if (results && results.length > 0) {
      const { center, name } = results[0];
      const { lat, lng } = center;
      setCoord([lat, lng]);
      setLocationMarkers([{ lat, lon: lng, address: name }]);
    } else {
      alert("Location not found");
    }
  } catch (error) {
    console.error("Geocoder error:", error);
    alert("Geocoder failed to fetch results");
  }
};
