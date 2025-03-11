import { getCities } from "../../../db/mongo";

interface LocationsListPageProps {
    params: {
        locale: string;
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
                            <a href={`/${locale}/exhibitions/cities/${encodeURIComponent(city.city)}`}>{city.city}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
