import { NextResponse } from "next/server";
import { addExhibition } from "@/db/mongo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, location, url, domain, imageUrl, ...rest } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL required" },
        { status: 400 }
      );
    }

    const exhibitionData = {
      ...rest,
      title,
      location,
      url,
      domain,
      image_reference: [imageUrl],
      show: true,
    };

    const inserted = await addExhibition(exhibitionData);

    return NextResponse.json({ success: true, exhibition: inserted });
  } catch (err) {
    console.error("Error creating exhibition:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { addExhibition } from "@/db/mongo"; // You'll need this
// import { v4 as uuidv4 } from "uuid";

// interface R2Config {
//   region: string;
//   endpoint: string;
//   credentials: {
//     accessKeyId: string;
//     secretAccessKey: string;
//   };
//   forcePathStyle?: boolean;
// }

// function getR2Config(): R2Config {
//   const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
//   const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
//   const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;

//   if (!accessKeyId || !secretAccessKey || !accountId) {
//     throw new Error("Missing R2 configuration in environment variables");
//   }

//   return {
//     region: "auto",
//     endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
//     credentials: {
//       accessKeyId,
//       secretAccessKey,
//     },
//     forcePathStyle: true,
//   };
// }

// export async function POST(req: Request) {
//   const r2Client = new S3Client(getR2Config());
//   const body = await req.json();
//   const { title, location, url, domain, imageUrl, ...rest } = body;

//   if (!imageUrl) {
//     return NextResponse.json({ error: "Image URL required" }, { status: 400 });
//   }

//   try {
//     // 1. Fetch and upload the image to R2
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     const buffer = Buffer.from(await blob.arrayBuffer());

//     const newExhibitionId = uuidv4();
//     const fileName = `agenda/${newExhibitionId}/${uuidv4()}.jpg`;

//     await r2Client.send(
//       new PutObjectCommand({
//         Bucket: process.env.R2_BUCKET_NAME || "agenda",
//         Key: fileName,
//         Body: buffer,
//         ContentType: "image/jpeg",
//       })
//     );

//     const publicUrl = `https://${
//       process.env.R2_PUBLIC_URL || "pub-1070865a23b94011a35efcf0cf91803e.r2.dev"
//     }/${fileName}`;

//     console.log("this is the public URL, --", publicUrl);

//     // 2. Create the exhibition in Mongo
//     const exhibitionData = {
//       ...rest,
//       title,
//       location,
//       url,
//       domain,
//       image_reference: [publicUrl],
//       show: true,
//     };

//     const inserted = await addExhibition(exhibitionData); // save to Mongo
//     return NextResponse.json({ success: true, exhibition: inserted });
//   } catch (err) {
//     console.error("Create with image error", err);
//     return NextResponse.json(
//       { success: false, error: err instanceof Error ? err.message : "Unknown" },
//       { status: 500 }
//     );
//   }
// }
