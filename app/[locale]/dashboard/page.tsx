import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InstitutionDashboard from "@/components/dashboard/InstitutionDashboard";
import { extractDomain } from "@/utils/extractDomain";
import { getExhibitionsByDomain } from "@/db/mongo";
import { Exhibition } from "@/types";


export default async function DashboardPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get("auth_token");

  if (!auth) {
    redirect("/");
  }

  const user: { email: string } = JSON.parse(auth.value);
  // const domain = extractDomain(user.email);

  const domain = "petitpalais.paris.fr"


  const rawData = await getExhibitionsByDomain(domain);
  const data: Exhibition[] = rawData.map(doc => ({
    _id: (doc as any)._id?.toString() || "",
    title: (doc as any).title || "",
    date_begin_st: (doc as any).date_begin_st,
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

  return <InstitutionDashboard
    data={data}
  />;
}
