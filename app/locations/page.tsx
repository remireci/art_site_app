import { getLocations } from "../db/mongo";


export default async function LocationsListPage() {
    const locations: Array<any> = await getLocations();

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {locations.map(location => (
                    <li key={location.domain}>
                        <a href={`/locations/${location.domain}`}>{location.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
