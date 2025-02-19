import { NextResponse } from "next/server";
import { getLocations } from "../../../db/mongo";

// interface Location {
//   latitude: number;
//   longitude: number;
//   domain: string;
//   name: string;
// }

export async function GET() {
  try {
    console.log("API map/locations called");

    // Fetch locations using the existing function from db/mongo.js
    const locations = await getLocations();

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

    console.log("Filtered locations:", locations[23]);

    // return NextResponse.json(filteredLocations, { status: 200 });
    return NextResponse.json(filteredLocations, { status: 200 });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
