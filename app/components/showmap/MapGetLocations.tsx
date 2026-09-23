"use client";

import { useLocation } from "@/context/LocationContext";

type Props = {
  locale: string;
  partner?: string;
  city?: string;
  trackAnalytics?: boolean;
};

const labels: Record<string, string> = {
  en: "My location",
  fr: "Ma position",
  nl: "Mijn locatie",
};

export default function MapGetLocation({
  locale,
  partner,
  city,
  trackAnalytics = false,
}: Props) {
  const { getUserLocation } = useLocation();

  const handleClick = () => {
    if (trackAnalytics && window.umami) {
      window.umami.track("my_location", {
        partner: partner || "unknown",
        city: city || "random",
        locale,
      });
    }

    getUserLocation();
  };

  return <button onClick={handleClick}>{labels[locale] ?? labels.en}</button>;
}
