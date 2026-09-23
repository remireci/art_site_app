"use client";

import { useLocation } from "@/context/LocationContext";

type Props = {
  locale: string;
  partner?: string;
  city?: string;
};

const labels: Record<string, string> = {
  en: "My location",
  fr: "Ma position",
  nl: "Mijn locatie",
};

export default function EmbedGetLocation({ locale, partner, city }: Props) {
  const { getUserLocation } = useLocation();

  const handleClick = () => {
    if (window.umami) {
      window.umami.track("my location", {
        partner: partner || "unknown",
        city: city || "random",
        locale,
      });
    }
    getUserLocation();
  };

  return <button onClick={handleClick}>{labels[locale] ?? labels.en}</button>;
}
