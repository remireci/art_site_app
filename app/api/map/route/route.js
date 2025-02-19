import { SuperfaceClient } from '@superfaceai/one-sdk';

const sdk = new SuperfaceClient();

async function geocodeLocation(loc) {
    const profile = await sdk.getProfile('address/geocoding@3.1.2');
    const result = await profile.getUseCase('Geocode').perform(
        { query: loc },
        { provider: 'nominatim' }
    );

    try {
        const data = result.unwrap();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to geocode location');
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const locations = body.locations;

        if (locations.length !== 2) {
            return new Response(
                JSON.stringify({ error: 'Expected 2 waypoints' }),
                { status: 422, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const waypoints = await Promise.all(
            locations.map((location) => geocodeLocation(location))
        );
        return new Response(JSON.stringify({ waypoints }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(error.message, { status: 500 });
    }
}
