import { getMapData } from "@/lib/map/getMapData";
import EmbedMapClient from "@/components/embed/EmbedMapClient";

export default async function EmbedMapPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: {
    city?: string;
    partner?: string;
  };
}) {
  const { locale } = params;
  const city = searchParams.city || "";
  const partner = searchParams.partner || "";

  const { locations, exhibitions } = await getMapData();

  return (
    <main className="fixed inset-0 overflow-hidden">
      <EmbedMapClient
        locations={locations}
        exhibitions={exhibitions}
        locale={locale}
        city={city}
        partner={partner}
      />
    </main>
  );
}
