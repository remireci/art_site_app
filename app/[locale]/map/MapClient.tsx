"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SearchMap from "@/components/SearchMap";

import type { MapLocation, ExhibitionGroup } from "@/lib/map/getMapData";

const DynamicMap = dynamic(() => import("@/components/showmap/MapTest"), {
  ssr: false,
});

interface MapClientProps {
  locations: MapLocation[];
  exhibitions: ExhibitionGroup[];
  locale: string;
  initialCity?: string;
}

export default function MapClient({
  locations,
  exhibitions,
  locale,
  initialCity = "",
}: MapClientProps) {
  const [query, setQuery] = useState(initialCity);

  return (
    <div className="w-full">
      <div className="mx-auto mb-4 max-w-xl">
        <SearchMap query={query} setQuery={setQuery} onSearch={setQuery} />
      </div>

      <div className="w-full rounded bg-slate-200 p-2 sm:p-4">
        <DynamicMap
          searchQuery={query}
          locations={locations}
          groupedExhibitions={exhibitions}
          locale={locale}
          partner=""
        />
      </div>
    </div>
  );
}
