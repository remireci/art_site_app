"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { MapLocation, ExhibitionGroup } from "@/lib/map/getMapData";

import EmbedGetLocation from "@/components/embed/EmbedGetLocations";

const DynamicMap = dynamic(() => import("@/components/showmap/MapTest"), {
  ssr: false,
});

type EmbedMapClientProps = {
  locations: MapLocation[];
  exhibitions: ExhibitionGroup[];
  locale: string;
  city: string;
  partner: string;
};

export default function EmbedMapClient({
  locations,
  exhibitions,
  locale,
  city,
  partner,
}: EmbedMapClientProps) {
  useEffect(() => {
    const trackEmbedView = () => {
      if (window.umami) {
        window.umami.track("embed_view", {
          partner: partner || "unknown",
          city: city || "random",
          locale,
        });

        return true;
      }

      return false;
    };

    if (trackEmbedView()) return;

    const interval = window.setInterval(() => {
      if (trackEmbedView()) {
        window.clearInterval(interval);
      }
    }, 250);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [partner, city, locale]);

  return (
    <div
      className="relative h-full w-full"
      //   className="w-screen h-screen"
      data-partner={partner || undefined}
    >
      <DynamicMap
        searchQuery={city}
        locations={locations}
        groupedExhibitions={exhibitions}
        embedded
        locale={locale}
        partner={partner}
      />

      <div className="absolute top-3 left-14 z-[1000]">
        <div className="rounded bg-[#87bdd8] px-3 py-2 text-sm text-white shadow-md hover:bg-blue-800">
          <EmbedGetLocation locale={locale} partner={partner} city={city} />
        </div>
      </div>

      <a
        href={`https://www.artnowdatabase.eu/${locale}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 left-2 z-[1000] rounded bg-white/90 px-2 py-1 text-[10px] text-slate-600 shadow-sm"
      >
        Art exhibitions by Art Now Database
      </a>
    </div>
  );
}
