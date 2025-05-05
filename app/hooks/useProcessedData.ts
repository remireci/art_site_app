import { useRef, useState, useEffect } from "react";
import { processExhibitionsAndLocations } from "../lib/processExhibitions";
import { Exhibition, Location, ProcessedData } from "../types";

export const useProcessedData = (activeTab: string) => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const cacheRef = useRef<Map<string, ProcessedData>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = cacheRef.current.get(activeTab);
      if (cachedData) {
        setProcessedData(cachedData);
        return;
      }

      //   if (cacheRef.current.has(activeTab)) {
      //     setProcessedData(cacheRef.current.get(activeTab));
      //     return;
      //   }

      const URL =
        process.env.NODE_ENV === "production"
          ? "https://www.artnowdatabase.eu"
          : "http://localhost:3000";

      try {
        const locationsResponse = await fetch(`${URL}/api/map/locations`);
        const exhibitionsResponse = await fetch(`${URL}/api/exhibitions`);

        if (!locationsResponse.ok || !exhibitionsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const locations: Location[] = await locationsResponse.json();
        const exhibitions: Exhibition[] = await exhibitionsResponse.json();

        const { groupedExhibitions, processedLocations } =
          processExhibitionsAndLocations(exhibitions, locations);

        const dataToCache: ProcessedData = {
          processedLocations,
          groupedExhibitions,
        };
        cacheRef.current.set(activeTab, dataToCache);
        setProcessedData(dataToCache);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProcessedData(null);
      }
    };

    fetchData();
  }, [activeTab]);

  return processedData;
};
