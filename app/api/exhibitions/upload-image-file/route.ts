import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { updateImageReference } from "@/db/mongo";
import { v4 as uuidv4 } from "uuid";

interface R2Config {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  forcePathStyle?: boolean;
}

function getR2Config(): R2Config {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;

  if (!accessKeyId || !secretAccessKey || !accountId) {
    throw new Error("Missing R2 configuration in environment variables");
  }

  return {
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  };
}

export async function POST(req: Request) {
  const r2Client = new S3Client(getR2Config());

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const exhibitionId = formData.get("exhibitionId")?.toString();

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const usedExhibitionId = exhibitionId || uuidv4();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine content type (optional: validate type here too)
    const contentType = file.type || "application/octet-stream";

    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `agenda/${usedExhibitionId}/${uuidv4()}.${extension}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || "agenda",
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = `https://${
      process.env.R2_PUBLIC_URL || "pub-1070865a23b94011a35efcf0cf91803e.r2.dev"
    }/${fileName}`;

    console.log("Uploaded file to:", publicUrl);

    // database update is done in the [id] route
    // if (exhibitionId) {
    //   await updateImageReference(exhibitionId, publicUrl);
    // }

    return NextResponse.json(
      { message: "Image uploaded successfully", imageUrl: publicUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
