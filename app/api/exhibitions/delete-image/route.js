import { NextResponse } from "next/server";
import { deleteImageReference } from "@/db/mongo";
import { createClient } from "@supabase/supabase-js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Supabase client setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SERVICE_API_KEY
);

// Cloudflare R2 setup
const cloudflareClient = new S3Client({
  region: "auto", // Required for Cloudflare R2
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to delete an image from Cloudflare R2
async function deleteFromCloudflare(imageUrl) {
  const cloudflareBucketName = process.env.CLOUDFLARE_R2_BUCKET;
  // Extract file path from the full image URL
  const urlParts = new URL(imageUrl);
  const filePath = urlParts.pathname.substring(1); // Remove leading slash

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: cloudflareBucketName,
      Key: filePath,
    });

    await cloudflareClient.send(deleteCommand);
    console.log(`File deleted from Cloudflare R2: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error deleting file from Cloudflare R2:", error);
    return false;
  }
}

export async function POST(req) {
  try {
    const { exhibitionId, imagePath } = await req.json();

    if (!imagePath || !exhibitionId) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    console.log("Exhibition ID:", exhibitionId);
    console.log("Image path:", imagePath);

    // Remove the image reference from MongoDB
    const mongoRef = await deleteImageReference(exhibitionId, imagePath);

    if (!mongoRef) {
      console.error("Failed to delete image reference in MongoDB");
      return NextResponse.json(
        { error: "Failed to delete image reference in MongoDB" },
        { status: 500 }
      );
    }

    if (imagePath.includes("supabase.co/storage")) {
      // Supabase deletion
      const newFilePath = imagePath.replace(
        /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//,
        ""
      );

      console.log("Deleting from Supabase:", newFilePath);

      const { data, error } = await supabase.storage
        .from("Exhibition")
        .remove([newFilePath]);

      if (error) {
        console.error("Error deleting file from Supabase:", error);
        return NextResponse.json(
          { error: "Failed to delete file from Supabase" },
          { status: 500 }
        );
      }

      console.log("File successfully deleted from Supabase:", data);
      return NextResponse.json(
        { success: true, mongoRef, supabaseData: data },
        { status: 200 }
      );
    } else if (imagePath.includes("r2.dev")) {
      // Cloudflare R2 deletion
      console.log("Deleting from Cloudflare:", imagePath);

      const cloudflareSuccess = await deleteFromCloudflare(imagePath);

      if (!cloudflareSuccess) {
        return NextResponse.json(
          { error: "Failed to delete file from Cloudflare" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, mongoRef }, { status: 200 });
    }

    console.error("Unknown storage provider for image:", imagePath);
    return NextResponse.json(
      { error: "Unknown storage provider" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error removing image:", error);
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 }
    );
  }
}
