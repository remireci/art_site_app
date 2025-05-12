import { getCities } from "../../../db/mongo.js";
import { Metadata } from 'next';

interface LocationsListPageProps {
    params: {
        locale: string;
    };
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    // Load translations
    const messages = await import(`../../../../locales/${params.locale}/exhibitions.json`)
        .then(m => m.default)
        .catch(() => import(`../../../../locales/en/exhibitions.json`).then(m => m.default));

    return {
        title: messages.cities.metaTitle || "Art Exhibitions by City",
        description: messages.cities.metaDescription || "Browse art exhibitions organized by city",
        alternates: {
            canonical: `/${params.locale}/exhibitions/cities`,
        },
        openGraph: {
            title: messages.cities.metaTitle || "Art Exhibitions by City",
            description: messages.cities.metaDescription || "Browse art exhibitions organized by city",
            images: [{
                url: '/og-cities.jpg', // Add an actual OG image
                width: 1200,
                height: 630,
            }]
        }
    };
}

export default async function CityList({ params }: LocationsListPageProps) {
    const { locale } = params;
    const cities: Array<any> = await getCities();

    return (
        <main className="flex flex-col items-center p-4 min-h-screen text-slate-500">
            <div>
                <h1>Cities</h1>
                <div className="p-1 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                    <a href="/">
                        <h1 className="text-xl w-auto uppercase hover:text-gray-600 ">
                            Search exhibitions
                        </h1>
                    </a>
                </div>
                <ul className="">
                    {cities.map(city => (
                        <li key={city.id}>
                            <a href={`/${locale}/exhibitions/cities/${encodeURIComponent(city.slug)}`}>{city.city}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
