import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InstitutionDashboard from "@/components/dashboard/InstitutionDashboard";
import { extractDomain } from "@/utils/extractDomain";
import { getExhibitionsByDomain, getLocationByDomain } from "@/db/mongo";
import { Exhibition } from "@/types";


export default async function DashboardPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get("auth_token");

  if (!auth) {
    redirect("/");
  }

  const user: { email: string } = JSON.parse(auth.value);
  const domain = extractDomain(user.email);

  // const domain = "petitpalais.paris.fr"


  const rawExhibitionsData = await getExhibitionsByDomain(domain, { includeHidden: true, includeFuture: true });

  console.log("raw exhibitions data", rawExhibitionsData)

  const exhibitionsData: Exhibition[] = rawExhibitionsData.map(doc => ({
    _id: (doc as any)._id?.toString() || "",
    title: (doc as any).title || "",
    date_begin_st: (doc as any).date_begin_st || "",
    date_end_st: (doc as any).date_end_st || "",
    location: (doc as any).location || "",
    url: (doc as any).url || "",
    domain: (doc as any).domain || "",
    artists: (doc as any).artists,
    image_reference: Array.isArray((doc as any).image_reference) ? (doc as any).image_reference : [],
    exhibition_url: (doc as any).exhibition_url,
    origin: (doc as any).origin,
    city: (doc as any).city,
    missing_date_searched: (doc as any).missing_date_searched,
    show: typeof (doc as any).show === "boolean" ? (doc as any).show : true,
  }));

  const rawLocationData = await getLocationByDomain(domain);
  const locationData = rawLocationData ? {
    _id: rawLocationData._id?.toString() || "",
    location: rawLocationData.location || "",
    city: rawLocationData.city || "",
    phone: rawLocationData.phone || "",
    address: rawLocationData.address || "",
    mail: rawLocationData.mail || "",
    description: rawLocationData.description || "",
    url: rawLocationData.url || "",
    domain: rawLocationData.domain || "",
    show: rawLocationData.show || false,
    coordinates: {
      latitude: rawLocationData.coordinates?.latitude ?? null,
      longitude: rawLocationData.coordinates?.longitude ?? null,
    },
    check_coordinates: rawLocationData.check_coordinates || false,
    exhibitions_last_checked: rawLocationData.exhibitions_last_checked?.toString() || "",
    exhibitions_url: rawLocationData.exhibitions_url || "",
    slug: rawLocationData.slug || "",
    domain_slug: rawLocationData.domain_slug || "",
  } : null;


  return <InstitutionDashboard
    exhibitionsData={exhibitionsData}
    locationData={locationData}
  />;
}
