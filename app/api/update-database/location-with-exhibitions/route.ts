import { NextResponse } from "next/server";
import { getLocations, getExhibitionsByDomain } from "@/db/mongo";
import pLimit from "p-limit";
import clientPromise from "@/lib/mongoClient";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Agenda");

    const locations = await getLocations();

    const limit = pLimit(2); // Control concurrency

    const updatePromises = locations.map((location) =>
      limit(async () => {
        if (
          !location.domain ||
          typeof location.domain !== "string" ||
          location.domain.trim() === ""
        ) {
          console.warn(`Skipping location ${location._id} — invalid domain`);
          return null;
        }

        try {
          const exhibitions = await getExhibitionsByDomain(location.domain, {
            includeFuture: true,
            includePast: false,
            includeHidden: false,
          });

          return {
            domain: location.domain,
            hasExhibitions: exhibitions.length > 0,
          };
        } catch (error) {
          console.error(`Error for domain ${location.domain}:`, error);
          return null;
        }
      })
    );

    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter((r) => r !== null);

    const bulkOps = successfulUpdates.map(({ domain, hasExhibitions }) => ({
      updateOne: {
        filter: { domain },
        update: {
          $set: {
            hasExhibitions,
            lastChecked: new Date(),
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      // await db.collection("Locations").bulkWrite(bulkOps);
      const chunkSize = 50;
      for (let i = 0; i < bulkOps.length; i += chunkSize) {
        const chunk = bulkOps.slice(i, i + chunkSize);
        await db.collection("Locations").bulkWrite(chunk);
        console.log(
          `Processed chunk ${i / chunkSize + 1} of ${Math.ceil(
            bulkOps.length / chunkSize
          )}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      updated: successfulUpdates.length,
      skipped: results.length - successfulUpdates.length,
    });
  } catch (error: any) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update exhibitions", details: error.message },
      { status: 500 }
    );
  }
}
