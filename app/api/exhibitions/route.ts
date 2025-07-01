import { NextResponse, NextRequest } from "next/server";
import { getAgendaItems, addExhibition } from "../../db/mongo.js";

export async function GET(
  req: NextRequest,
  { params }: { params: { location: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    const currentDateString = new Date().toISOString().split("T")[0];

    const baseFilter: any = {
      show: true,
      date_end_st: { $gt: currentDateString },
      $or: [
        { date_begin_st: { $exists: false } },
        { date_begin_st: null },
        { date_begin_st: "" },
        { date_begin_st: { $not: { $regex: /^\d{4}-\d{2}-\d{2}$/ } } },
        {
          date_begin_st: {
            $lte: currentDateString,
            $regex: /^\d{4}-\d{2}-\d{2}$/,
          },
        },
      ],
    };

    // Override when domain is present
    const filter = domain
      ? {
          domain,
          // No `show: true` — include both true and false
          // No `date_end_st` restriction — include all future/past
          $or: [
            { date_begin_st: { $exists: false } },
            { date_begin_st: null },
            { date_begin_st: "" },
            { date_begin_st: { $not: { $regex: /^\d{4}-\d{2}-\d{2}$/ } } },
            {
              date_begin_st: {
                $regex: /^\d{4}-\d{2}-\d{2}$/, // valid date, any time
              },
            },
          ],
        }
      : baseFilter;

    const exhibitions = await getAgendaItems(filter, {
      title: 1,
      location: 1,
      url: 1,
      image_reference: 1,
    });

    return NextResponse.json(exhibitions, { status: 200 });
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    const required = [
      "title",
      "date_end_st",
      "location",
      "url",
      "domain",
      "image_reference",
    ];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Optional: clean data or add timestamps
    const newExhibition = {
      ...data,
      createdAt: new Date(),
    };

    const inserted = await addExhibition(newExhibition);

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error("Error adding exhibition:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
