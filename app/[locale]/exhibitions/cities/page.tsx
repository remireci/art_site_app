import { getCities } from "../../../db/mongo.js";
import { Metadata } from 'next';
import Link from 'next/link';

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
    const cities: Array<any> = await getCities({ onlyWithExhibitions: true });
    const messages = await import(`../../../../locales/${params.locale}/exhibitions.json`)
        .then(m => m.default)
        .catch(() => import(`../../../../locales/en/exhibitions.json`).then(m => m.default));

    return (
        <div className="p-4 min-h-screen text-slate-500">
            <div className="flex flex-col items-center">
                <h1 className="mt-20 text-xl font-semibold">{messages.city_title}</h1>
                <div className="p-1 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                    <Link href="/" className="text-xl uppercase hover:text-gray-300">
                        {messages.search}
                    </Link>
                </div>
                <ul className="space-y-2">
                    {cities.map(city => (
                        <li key={city.id}>
                            <h2 className="text-lg">
                                <Link
                                    href={`/${locale}/exhibitions/cities/${(city.slug)}`}
                                    className="hover:underline"
                                >
                                    {city.city}
                                </Link>
                            </h2>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
