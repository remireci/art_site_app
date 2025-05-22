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
  const { imageUrl, exhibitionId } = await req.json();

  if (!imageUrl || !exhibitionId) {
    return NextResponse.json(
      { error: "No image URL or exhibition ID provided" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch source image");

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    // 2. Generate unique filename
    const fileName = `agenda/${exhibitionId}/${uuidv4()}.jpg`;

    // 3. Upload to R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || "agenda",
        Key: fileName,
        Body: buffer,
        ContentType: "image/jpeg",
      })
    );

    // 4. Generate public URL
    const publicUrl = `https://${
      process.env.R2_PUBLIC_URL || "pub-1070865a23b94011a35efcf0cf91803e.r2.dev"
    }/${fileName}`;

    console.log("bucket url", publicUrl);

    // 5. Update database reference
    await updateImageReference(exhibitionId, publicUrl);

    return NextResponse.json(
      {
        message: "Image uploaded to R2 successfully",
        imageUrl: publicUrl,
      },
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
