import { NextResponse } from "next/server";
// import { addadvertisement } from "@/db/mongo";

const durationToWeeks = {
  "1week": 1,
  "2weeks": 2,
  "4weeks": 4,
  "8weeks": 8,
} as const;

const durationToPrice = {
  "1week": 120,
  "2weeks": 220,
  "4weeks": 390,
  "8weeks": 700,
} as const;

type DurationKey = keyof typeof durationToWeeks;

function isValidDuration(value: any): value is DurationKey {
  return value in durationToWeeks;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      imageUrl,
      link,
      startDate,
      duration = "1week",
      price,
      notes = "",
    } = body;

    if (!email || !imageUrl || !link || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidDuration(duration)) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    // Calculate end date from duration
    const weeks = durationToWeeks[duration] || 1;
    const start_date = new Date(startDate);
    const end_date = new Date(start_date);
    end_date.setDate(start_date.getDate() + weeks * 7);

    const adData = {
      email,
      image_url: imageUrl,
      link,
      start_date,
      end_date,
      duration,
      price: Number(price),
      notes,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // const inserted = await addadvertisement(adData);

    // return NextResponse.json({ success: true, advertisement: inserted });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error creating advertisement:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}
