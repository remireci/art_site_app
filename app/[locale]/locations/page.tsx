import { getLocations } from "../../db/mongo";


export default async function LocationsListPage() {
    const locations: Array<any> = await getLocations();
    const filteredLocations = locations.filter(location => location.name !== "N/A");

    return (
        <main className="flex flex-col items-center p-4 min-h-screen text-slate-100">
            <div>
                <h1>Locations</h1>
                <div className="p-1 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm  rounded flex items-center justify-center">
                    <a href="/">
                        <h1 className="text-xl w-auto uppercase hover:text-gray-600">
                            Search exhibitions
                        </h1>
                    </a>
                </div>
                <ul className="">
                    {filteredLocations.map(location => (
                        <li key={location.domain} className="bg-slate-100">
                            <a href={`/locations/${location.domain}`}>{location.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}

