import { NextResponse } from "next/server";
import { createLocation } from "@/db/mongo";
import { sendAndEmail } from "@/lib/email/sendAndEmail";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.location || !data.city || !data.domain) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const insertedId = await createLocation(data);

    const result = await sendAndEmail(data.mail);

    return NextResponse.json({ insertedId, result }, { status: 201 });
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
