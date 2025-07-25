"use client";
import { useState, useEffect } from "react";
import type { Exhibition } from "@/types";
import EditableCheckbox from "./EditableCheckbox";
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react";

interface EditExhibitionFormProps {
    initialData: Exhibition;
    onSave: (updatedData: Exhibition) => void;
    onCancel: () => void;
}

type ExhibitionPayload = Omit<Exhibition, "_id"> & {
    origin: string;
    imageUrl?: string; // optional, only used to update image_reference
};


export default function EditExhibitionForm({
    initialData,
    onSave,
    onCancel,
}: EditExhibitionFormProps) {
    const isExhibitionEditing = Boolean(initialData._id);
    const [formData, setFormData] = useState<Exhibition>({
        ...initialData,
        image_reference: Array.isArray(initialData.image_reference)
            ? initialData.image_reference
            : initialData.image_reference
                ? [initialData.image_reference]
                : [],
    });
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMode, setUploadMode] = useState<"link" | "file">("link")
    const [isUploading, setIsUploading] = useState(false);
    const [imageIsUploading, setImageIsUploading] = useState(false);
    const [isRemovingImage, setIsRemovingImage] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async () => {

        if (isUploading) return;

        setIsUploading(true);

        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.date_end_st?.trim()) newErrors.date_end_st = "End date is required.";
        if (!imageUrl?.trim() && !selectedFile && formData.image_reference[0] === "") {
            newErrors.image = "Image is required.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setIsUploading(false);
            return;
        }

        const origin = "USER";
        let finalImageUrl = formData.image_reference?.[0]; // default to existing image

        try {
            // If user provided a new image link            
            if (uploadMode === "link" && imageUrl?.trim()) {
                const resImage = await fetch("/api/exhibitions/upload-image-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl }),
                });

                const imageData = await resImage.json();
                if (!imageData?.imageUrl) throw new Error("Image upload (URL) failed");
                finalImageUrl = imageData.imageUrl;
            }

            // If user uploaded a new file
            if (uploadMode === "file" && selectedFile) {
                const formDataFile = new FormData();
                formDataFile.append("file", selectedFile);
                if (formData._id) {
                    formDataFile.append("exhibitionId", formData._id);
                }

                const resImage = await fetch("/api/exhibitions/upload-image-file", {
                    method: "POST",
                    body: formDataFile,
                });

                const imageData = await resImage.json();
                if (!imageData?.imageUrl) throw new Error("Image upload (file) failed");
                finalImageUrl = imageData.imageUrl;
            }

            const { image_reference, ...formDataWithoutImageRef } = formData;

            const cleanedImageReference = finalImageUrl
                ? Array.from(new Set([...(formData.image_reference || []), finalImageUrl]))
                : formData.image_reference;
            // Strip image_reference to avoid conflict

            // console.log("formDataWithoutImageRef JSON:", JSON.stringify(formDataWithoutImageRef, null, 2));


            const payload: ExhibitionPayload = {
                ...formDataWithoutImageRef,
                image_reference: cleanedImageReference,
                origin,
                imageUrl: finalImageUrl,
            };

            // console.log("formDataWithoutImageRef JSON:", JSON.stringify(payload, null, 2));

            let updatedFormData = formData;

            if (!formData._id) {
                const res = await fetch("/api/exhibitions/create-exhibition", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!data.exhibition?._id) throw new Error("Missing ID after creation");
                updatedFormData = data.exhibition;
            } else {
                const res = await fetch(`/api/exhibitions/${formData._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const result = await res.json();
                if (!result.success) {
                    console.error("Update failed:", result.error);
                    return;
                }
            }

            console.log("this is the updateformdate", updatedFormData);

            onSave?.(updatedFormData);

        } catch (err) {
            console.error("Error updating exhibition", err);
        } finally {
            setIsUploading(false);
        }
    };


    // Deprecated: This function is no longer called in the UI.
    // It remains for reference or future development.

    const handleUpload = async () => {

        if (!imageUrl) return;
        setImageIsUploading(true);

        const response = await fetch("/api/exhibitions/upload-image-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl, exhibitionId: formData._id }),
        });

        const data = await response.json();

        if (data.imageUrl) {
            setFormData((prev) => ({
                ...prev,
                image_reference: [...prev.image_reference, data.imageUrl],
            }));
        }
        setImageIsUploading(false);
        setShowUploadPopup(false);
        setImageUrl("");
    };

    const handleRemoveImage = async () => {

        setIsRemovingImage(true)

        const updatedImages = [...formData.image_reference];
        updatedImages.splice(0, 1);
        const imagePath = formData.image_reference[0];

        try {
            const response = await fetch('/api/exhibitions/delete-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    exhibitionId: formData._id, // Assuming `_id` identifies the exhibition
                    imagePath,
                }),
            });

            const data = await response.json();

            setFormData((prev) => ({
                ...prev,
                image_reference: updatedImages,
            }));

            setIsRemovingImage(false);
            onSave?.(data);

            if (!response.ok) {
                throw new Error('Failed to remove image from server');
            }

            // Optionally, show a success message to the user here
        } catch (error) {
            console.error('Error removing image:', error);
            // Optionally, show an error message to the user
        } finally {
            setIsRemovingImage(false);
        }
    };

    const toggleShow = async () => {
        const newShow = !formData.show;
        setFormData((prev) => ({ ...prev, show: newShow }));

        if (!formData._id) return;

        await fetch(`/api/exhibitions/${formData._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ show: newShow }),
        });
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormData((prev) => ({ ...prev, show: !e.target.checked }));
    // };

    // const handleImageChange = (index: number, value: string) => {
    //     const newImages = [...formData.image_reference];
    //     newImages[index] = value;
    //     setFormData((prev) => ({ ...prev, image_reference: newImages }));
    // };


    return (
        <div
            className="flex flex-col gap-2 p-4 border rounded shadow w-full max-w-[370px] bg-white">
            <div className="flex flex-col items-center mx-2 uppercase text-sm">
                {isExhibitionEditing ? (<p>
                    Edit Exhibition
                </p>) : (
                    <p>
                        Add Exhibition
                    </p>
                )
                }
            </div>

            <label className="text-xs font-medium">Title</label>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                required
            />
            {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}

            <label className="text-xs font-medium">Start Date</label>
            <input
                type="text"
                name="date_begin_st"
                value={formData.date_begin_st ?? ""}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
            />

            <label className="text-xs font-medium">End Date</label>
            <input
                type="text"
                name="date_end_st"
                value={formData.date_end_st}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                required
            />
            {errors.date_end_st && <span className="text-red-500 text-xs">{errors.date_end_st}</span>}

            <label className="text-xs font-medium">Artists</label>
            <textarea
                name="artists"
                value={formData.artists ?? ""}
                onChange={handleChange}
                placeholder="Artists"
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                rows={2}
            />

            <label className="text-xs font-medium">Exhibition URL</label>
            <input
                type="text"
                name="exhibition_url"
                value={formData.exhibition_url ?? ""}
                onChange={handleChange}
                placeholder="Exhibition URL"
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
            />

            <label className="text-xs font-medium">City</label>
            <input
                type="text"
                name="city"
                value={formData.city ?? ""}
                onChange={handleChange}
                placeholder="City"
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
            />
            {/* </div> */}

            {/* <label className="text-xs font-medium">Image Reference</label>
            <input
                type="text"
                value={formData.image_reference?.[0] ?? ""}
                onChange={(e) => handleImageChange(0, e.target.value)}
                className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
            />

            <label className="text-xs flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    checked={!formData.show}
                    onChange={handleCheckboxChange}
                />
                Don't show
            </label> */}

            {/* <div className="flex justify-between mt-4">
                <button
                    type="submit"
                    className="shrink-0 text-sm h-6 mt-2 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="shrink-0 text-sm h-6 mt-2 px-2 rounded bg-gray-50 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
                >
                    Cancel
                </button>
            </div> */}

            {/* </form> */}
            {/* --- Image Section --- */}
            {(formData.image_reference && formData.image_reference.length > 0 && formData.image_reference[0] !== "") && (
                <div className="space-y-2">
                    <p className="text-xs font-medium">Image</p>
                    <div className="flex flex-col items-center space-y-2">
                        <img
                            src={formData.image_reference[0]}
                            className="w-30 h-20 object-cover rounded"
                            alt="Exhibition image"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="bg-red-500 text-white text-xs px-1 rounded"
                        >
                            {isRemovingImage ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Remove"
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* --- Upload Popup --- */}
            {(formData.image_reference[0] === "" || formData.image_reference.length === 0 || !formData.image_reference) && (

                <div className="space-y-2">
                    <div className="flex space-x-4 mb-4">
                        <label className="flex items-center space-x-1">
                            <input
                                type="radio"
                                value="link"
                                checked={uploadMode === "link"}
                                onChange={() => setUploadMode("link")}
                            />
                            <span className="text-sm">Image Link</span>
                        </label>
                        <label className="flex items-center space-x-1">
                            <input
                                type="radio"
                                value="file"
                                checked={uploadMode === "file"}
                                onChange={() => setUploadMode("file")}
                            />
                            <span className="text-sm">Image File</span>
                        </label>
                    </div>
                    {uploadMode === "link" && (
                        <>
                            <label className="text-xs font-medium">Upload Image Link</label>
                            <div className="flex space-x-2 bg-blue-100 p-1 rounded items-center mt-4">
                                <input
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="flex-1 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                                    placeholder="Paste image URL..."
                                />
                                {/* {isExhibitionEditing && (<button
                                    disabled={imageIsUploading}
                                    onClick={handleUpload}
                                    className={cn(
                                        "shrink-0 text-sm h-6 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800 flex items-center justify-center",
                                        imageIsUploading && "cursor-not-allowed opacity-70"
                                    )}
                                >
                                    {imageIsUploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                                )} */}

                            </div>
                        </>
                    )}
                    {uploadMode === "file" && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Upload Image File</label>
                            <div className="flex items-center space-x-4 bg-blue-100 p-2 rounded">
                                {/* Hidden native file input */}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                        }
                                    }}
                                    className="hidden"
                                />

                                {/* Custom button that triggers file input */}
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer text-sm px-4 py-1 rounded border-2 border-orange-400 bg-slate-50 hover:bg-orange-400"
                                >
                                    Choose File
                                </label>

                                {/* Show file name if selected */}
                                {selectedFile && (
                                    <span className="text-sm text-slate-600 truncate max-w-[200px]">
                                        {selectedFile.name}
                                    </span>
                                )}
                            </div>
                        </div>

                    )}
                </div>
            )}
            {(errors.image && (formData.image_reference[0] === "" || formData.image_reference.length === 0 || !formData.image_reference)) && <span className="text-red-500 text-xs">{errors.image}</span>}
            {/* --- Visibility Toggle --- */}
            {isExhibitionEditing && (
                <label className="flex flex-row items-center space-x-2 mt-4">

                    <EditableCheckbox
                        label=""
                        checked={formData ? !formData.show : false}
                        onChange={toggleShow}
                    />

                    <span className="text-gray-600 text-sm -mt-2">Don&apos;t show this exhibition</span>
                </label>
            )}
            {/* --- Action Buttons --- */}
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    onClick={onCancel}
                    className="shrink-0 text-sm h-6 px-3 rounded bg-gray-200 text-gray-800 hover:bg-blue-800"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="shrink-0 text-sm h-6  bg-[#87bdd8] hover:bg-blue-700 text-slate-100 px-4 rounded flex items-center justify-center">
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Save"
                    )}
                </button>
            </div>
        </div >
    );
}