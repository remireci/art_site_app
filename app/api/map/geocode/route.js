import { NextResponse } from "next/server";
const { SuperfaceClient } = require('@superfaceai/one-sdk');

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

export async function GET(req) {
    try {
        const url = new URL(req.url);
        console.log("do we hava hava de urllllllllllllllllllllllllllllllN?", url)
        const location = url.searchParams.get('location');
        const coordinates = await geocodeLocation(location);
        return new Response(JSON.stringify({ location, coordinates }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(error.message, { status: 500 });
    }
}
