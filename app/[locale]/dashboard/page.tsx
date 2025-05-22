import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InstitutionDashboard from "@/components/dashboard/InstitutionDashboard";
import { extractDomain } from "@/utils/extractDomain";
import { getExhibitionsByDomain } from "@/db/mongo";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get("auth_token");

  if (!auth) {
    redirect("/");
  }

  const user: { email: string } = JSON.parse(auth.value);
  // const domain = extractDomain(user.email);

  const domain = "petitpalais.paris.fr"

  console.log("thisis the user", domain);

  const data = await getExhibitionsByDomain(domain);

  // return <DashboardClient />;
  return <InstitutionDashboard
    data={data}
  />;
}
