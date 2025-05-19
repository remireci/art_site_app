import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardPage() {
    const cookieStore = cookies();
    const auth = cookieStore.get("auth_token");

    if (!auth) {
        redirect("/");
    }

    const user = JSON.parse(auth.value);

    return <h1>Welcome, {user.email}</h1>;
}
