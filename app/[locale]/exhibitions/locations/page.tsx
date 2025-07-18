import { getLocations } from "../../../db/mongo.js";
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
    const messages = await import(`../../../../locales/${params.locale}/exhibitions.json`)
        .then(m => m.default)
        // @ts-ignore
        .catch(() => import(`../../../../locales/en/exhibitions.json`).then(m => m.default));

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
    const locations: Array<any> = await getLocations({ onlyWithExhibitions: true });
    const filteredLocations = locations.filter(location => location.name !== "N/A");
    const { locale } = params;
    const messages = await import(`../../../../locales/${params.locale}/exhibitions.json`)
        .then(m => m.default)
        .catch(() => import(`../../../../locales/en/exhibitions.json`).then(m => m.default));

    return (
        <div className="p-4 min-h-screen text-slate-600">
            <div className="flex flex-col items-center">
                <h1 className="mt-20 text-xl font-semibold">{messages.location_title}</h1>
                <div className="p-1 h-8 w-80 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                    <Link href="/" className="text-xl uppercase hover:text-gray-300">
                        {messages.search}
                    </Link>
                </div>
                <ul className="space-y-2">
                    {filteredLocations.map(location => {
                        // const safeDomain = location.domain.replace(/\./g, "-");

                        return (
                            < li
                                key={`${location._id}-${location.domain}-${location.location}-${location.coordinates}`}
                            // className="bg-slate-100"
                            >
                                <h2 className="text-lg">
                                    <Link
                                        href={`/${locale}/exhibitions/locations/${location.domain_slug}`}
                                        className="hover:underline"
                                    >
                                        {location.name}
                                    </Link>
                                </h2>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div >
    );
}

