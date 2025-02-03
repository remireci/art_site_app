// @deprecated

import { NextResponse } from 'next/server';
import { getAgendaItems } from '../../db/mongo';

export async function GET() {
    try {
        // Fetch exhibitions that have at least one image
        const exhibitions = await getAgendaItems(
            { image_reference: { $exists: true, $ne: [] } },
            { title: 1, location: 1, url: 1, image_reference: 1 }
        );
        console.log(exhibitions);

        return NextResponse.json(exhibitions, { status: 200 });
    } catch (error) {
        console.error('Error fetching exhibitions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
