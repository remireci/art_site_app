import { NextResponse } from "next/server";
import { getLocations } from "../../../db/mongo.js";


export async function GET() {
  try {
    console.log("API map/locations called");

    const locations = await getLocations({ onlyWithExhibitions: true });

    if (!locations) {
      console.log("No locations found");
      return NextResponse.json(
        { error: "Locations not found" },
        { status: 404 }
      );
    }

    const filteredLocations = locations.filter(
      (location) => location.name !== "N/A"
    );


    return NextResponse.json(filteredLocations, { status: 200 });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
