import { NextResponse } from 'next/server';
import { getAgendaItems } from '../../db/mongo.js';


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
                    { date_begin_st: { $exists: false } }, // Doesn't exist
                    { date_begin_st: null }, // Explicitly null
                    { date_begin_st: "" }, // Empty string
                    { date_begin_st: { $not: { $regex: /^\d{4}-\d{2}-\d{2}$/ } } }, // Invalid date format
                    { date_begin_st: { $lte: currentDateString, $regex: /^\d{4}-\d{2}-\d{2}$/ } } // Valid date in the past
                ]
            },
            { title: 1, location: 1, url: 1, image_reference: 1 }
        );


        // // Log the number of exhibitions
        // console.log(`Number of exhibitions fetched: ${exhibitions.length}`);

        // // Get unique locations using a Set
        // const uniqueLocations = new Set(exhibitions.map(exhibition => exhibition.location));

        // // Log the count of unique locations
        // console.log(`Number of unique locations: ${uniqueLocations.size}`);


        return NextResponse.json(exhibitions, { status: 200 });
    } catch (error) {
        console.error('Error fetching exhibitions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
