import { getLocations } from "../../../db/mongo";
import Link from "next/link";
import { Metadata } from 'next';

interface LocationsListPageProps {
    params: {
        locale: string;
    };
}


// app/[locale]/exhibitions/locations/page.tsx


export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    // Load translations
    const messages = await import(`../../../../locales/${params.locale}/location.json`)
        .then(m => m.default)
        // @ts-ignore
        .catch(() => import(`../../../../locales/en/location.json`).then(m => m.default));

    return {
        title: messages.locations.metaTitle || "Art Venues Worldwide",
        description: messages.locations.metaDescription || "Discover art galleries and museums hosting current exhibitions",
        alternates: {
            canonical: `/${params.locale}/exhibitions/locations`,
        },
        keywords: messages.locations.metaKeywords || "art venues, museums, galleries, exhibition spaces"
    };
}

export default async function LocationsListPage({ params }: LocationsListPageProps) {
    const locations: Array<any> = await getLocations();
    const filteredLocations = locations.filter(location => location.name !== "N/A");
    const { locale } = params;

    return (
        <main className="flex flex-col items-center p-4 min-h-screen text-slate-600">
            <div>
                <h1>Locations</h1>
                <div className="p-1 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm  rounded flex items-center justify-center">
                    <Link href="/">
                        <h1 className="text-xl w-auto uppercase hover:text-gray-600">
                            Search exhibitions
                        </h1>
                    </Link>
                </div>
                <ul className="">
                    {filteredLocations.map(location => {
                        const safeDomain = location.domain.replace(/\./g, "-");

                        return (
                            < li key={location.domain && location._id} className="bg-slate-100" >
                                <Link href={`/${locale}/exhibitions/locations/${safeDomain}`}>{location.name}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main >
    );
}

