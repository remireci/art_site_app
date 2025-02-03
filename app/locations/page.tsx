import { getLocations } from "../db/mongo"; // Fetch locations from exhibitions

function normalizeLocationUrl(url: String) {
    // Remove "http://", "https://", "www.", and any trailing slashes
    let normalizedUrl = url.replace(/^https?:\/\//, ''); // Remove http:// or https://
    normalizedUrl = normalizedUrl.replace(/^www\./, ''); // Remove www.
    normalizedUrl = normalizedUrl.replace(/\/$/, ''); // Remove trailing slash
    return normalizedUrl;
}

export default async function LocationsListPage() {
    const locations = await getLocations(); // Fetch all unique locations

    const uniqueLocations = new Map();

    locations.forEach(location => {
        const normalizedUrl = normalizeLocationUrl(location.domain);

        // If the normalized URL is not already in the map, add it
        if (!uniqueLocations.has(normalizedUrl)) {
            uniqueLocations.set(normalizedUrl, location);
        }
    });

    const filteredLocations = Array.from(uniqueLocations.values());

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {filteredLocations.map(location => (
                    <li key={location.domain}>
                        <a href={`/locations/${location.domain}`}>{location.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
