"use client"
import { useState } from "react";
import type { Exhibition } from "@/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"

export default function EditExhibitionImage({
    exhibition,
    onClose,
    onImageUpdate,
}: {
    exhibition: Exhibition;
    onClose: () => void;
    onImageUpdate: (updated: Exhibition) => void;
}) {
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [imageRemoving, setImageRemoving] = useState(false);

    const handleUpload = async () => {
        if (!imageUrl) return;

        setIsUploading(true);

        const response = await fetch("/api/exhibitions/upload-image-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl, exhibitionId: exhibition._id }),
        });

        const data = await response.json();

        if (data.imageUrl) {
            const updated = {
                ...exhibition,
                image_reference: [data.imageUrl], // replace or add image
            };
            onImageUpdate(updated);
            onClose();
        }

        setIsUploading(false);
        setImageUrl("");
    };

    const handleRemoveImage = async () => {
        const imagePath = exhibition.image_reference[0];
        setImageRemoving(true);
        const response = await fetch("/api/exhibitions/delete-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exhibitionId: exhibition._id, imagePath }),
        });

        if (response.ok) {
            const updated = {
                ...exhibition,
                image_reference: [],
            };
            onImageUpdate(updated);
            setImageRemoving(false);
            onClose();
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Edit Image</h2>

            {(exhibition.image_reference[0] === "" || exhibition.image_reference.length === 0 || !exhibition.image_reference) && (
                <input
                    type="text"
                    placeholder="Paste image URL"
                    className="w-full p-2 border rounded mb-2"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />

            )}

            <div className="flex justify-center items-center">
                {(exhibition.image_reference[0] === "" || exhibition.image_reference.length === 0 || !exhibition.image_reference) && (
                    <button
                        disabled={isUploading}
                        onClick={handleUpload}
                        className={cn(
                            "shrink-0 text-sm h-6 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800 flex items-center justify-center",
                            isUploading && "cursor-not-allowed opacity-70"
                        )}
                    >
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Upload"
                        )}
                    </button>
                )}

                {exhibition.image_reference.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium">Image</p>
                        <div className="flex flex-col items-center space-y-2">
                            <img
                                src={exhibition.image_reference[0]}
                                className="w-30 h-20 object-cover rounded"
                                alt="Exhibition image"
                            />
                            <button
                                disabled={imageRemoving}
                                onClick={handleRemoveImage}
                                className="bg-red-500 text-white text-xs px-1 rounded"
                            >
                                {imageRemoving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Remove"
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {(exhibition.image_reference[0] === "" || exhibition.image_reference.length === 0 || !exhibition.image_reference) && (

                    <button
                        onClick={onClose}
                        className="text-sm px-3 py-1 rounded border ml-2"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div >
    );
}
