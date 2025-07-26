import { MongoClient } from "mongodb";
import clientPromise from "@/lib/mongoClient";

// Connection URI, replace with your actual MongoDB connection string

export async function getValidAds() {
  const client = await clientPromise;
  const db = client.db("usersDb");
  const collection = db.collection("Ads");

  const today = new Date();

  const ads = await collection
    .find({
      start_date: { $lte: today },
      end_date: { $gte: today },
    })
    .sort({ priority: -1 })
    .toArray();

  return ads;
}
