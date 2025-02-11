import { NextResponse } from 'next/server';
import { getAgendaItems } from '../../db/mongo';

export async function GET() {
    try {
        // Get the current date (start of today)
        const currentDate = new Date();

        // Convert the current date to "YYYY-MM-DD" string format for the comparison
        const currentDateString = currentDate.toISOString().split('T')[0];

        // Fetch exhibitions that have at least one image and match the date conditions
        const exhibitions = await getAgendaItems(
            {
                image_reference: { $exists: true, $ne: [] },
                show: true,
                date_end_st: { $gt: currentDateString }, // Compare string dates
                $or: [
                    // Case when date_begin_st is either non-existent or in the future
                    { date_begin_st: { $exists: false } },
                    { date_begin_st: { $gte: currentDateString } }
                ]
            },
            { title: 1, location: 1, url: 1, image_reference: 1 }
        );

        // Log the number of exhibitions
        console.log(`Number of exhibitions fetched: ${exhibitions.length}`);

        return NextResponse.json(exhibitions, { status: 200 });
    } catch (error) {
        console.error('Error fetching exhibitions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
