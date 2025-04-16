import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getAgendaItems } from "../../../db/mongo.js"; // Adjust path based on your project structure

export async function GET(
  req: NextRequest,
  { params }: { params: { location: string } }
) {
  console.log("Received location param:", params.location);
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // const todayISOString = today.toISOString();
    const locationName = decodeURIComponent(params.location);

    // console.log("is the location passed?", params.location);

    // Query MongoDB for exhibitions at this location
    const exhibitions = await getAgendaItems({
      location: { $regex: `^${locationName}$`, $options: "i" },
      show: { $ne: false },
      $and: [
        {
          $or: [
            { date_begin_st: { $lte: today.toISOString() } }, // Include if begin date is <= today
            // { date_begin_st: { $eq: null } }, // Include if begin date is null
          ],
        },
        {
          $or: [
            { date_end_st: { $gte: today.toISOString() } }, // Include if end date is >= today
            // { date_end_st: { $eq: null } }, // Include if end date is null
          ],
        },
      ],
    });

    if (!exhibitions.length) {
      return NextResponse.json(
        { message: "No exhibitions found" },
        { status: 404 }
      );
    }

    console.log("API is returning exhibitions:", exhibitions);

    const filteredExhibitions = exhibitions.map(
      ({ title, description, image_reference, url, date_end_st }) => ({
        title,
        description,
        image_reference,
        url,
        date_end_st,
      })
    );

    return NextResponse.json({ filteredExhibitions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
