// app/api/locations/route.ts
import { NextResponse } from "next/server";
import { getAgendaItems } from "../../db/mongo";

export async function GET() {
  try {
    // Query MongoDB for unique locations (e.g., using aggregation)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Base conditions for date filtering
    const conditions = {
      date_end_st: { $gte: today.toISOString() },
      // show: { $ne: true },
    };

    const locations = await getAgendaItems(conditions);

    if (!locations.length) {
      return NextResponse.json(
        { message: "No locations found" },
        { status: 404 }
      );
    }

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}