import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "Agenda";
const collectionName = "Agenda_AI";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = new MongoClient(uri);
  try {
    const body = await request.json();

    console.log("Received ID param:", params?.id);
    const objectId = new ObjectId(params.id);

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const { _id, ...updatableFields } = body;

    console.log("update exh object ID", objectId);

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updatableFields }
    );

    console.log("update exh", result);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Error updatiing exhibition:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
