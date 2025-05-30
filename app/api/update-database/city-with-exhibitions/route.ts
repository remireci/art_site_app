import { NextResponse } from "next/server";
import { getCities, getExhibitionsByCity } from "@/db/mongo";
import pLimit from "p-limit";
import clientPromise from "@/lib/mongoClient";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Agenda");

    const cities = await getCities();
    console.log("Loaded cities:", cities.length);

    const limit = pLimit(5); // Control concurrency

    const updatePromises = cities.map((cityDoc) =>
      limit(async () => {
        if (
          !cityDoc.city ||
          typeof cityDoc.city !== "string" ||
          cityDoc.city.trim() === ""
        ) {
          console.warn(`Skipping city ${cityDoc.id} — invalid city name`);
          return null;
        }

        try {
          const exhibitions = await getExhibitionsByCity(cityDoc.city);

          return {
            cityId: cityDoc.id,
            hasExhibitions: exhibitions.length > 0,
          };
        } catch (error) {
          console.error(`Error for city ${cityDoc.city}:`, error);
          return null;
        }
      })
    );

    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter((r) => r !== null);

    const bulkOps = successfulUpdates.map(({ cityId, hasExhibitions }) => ({
      updateOne: {
        filter: {
          _id: typeof cityId === "string" ? new ObjectId(cityId) : cityId,
        },
        update: {
          $set: {
            hasExhibitions,
            lastChecked: new Date(),
          },
        },
      },
    }));

    try {
      if (bulkOps.length > 0) {
        const result = await db.collection("city_mapping").bulkWrite(bulkOps);
        console.log("Bulk write result:", result);
      }
    } catch (err) {
      console.error("Bulk write failed:", err);
    }

    return NextResponse.json({
      success: true,
      updated: successfulUpdates.length,
      skipped: results.length - successfulUpdates.length,
    });
  } catch (error: any) {
    console.error("City update failed:", error);
    return NextResponse.json(
      { error: "Failed to update city exhibitions", details: error.message },
      { status: 500 }
    );
  }
}
