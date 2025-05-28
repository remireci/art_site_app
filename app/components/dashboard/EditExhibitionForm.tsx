"use client";

import { useState } from "react";
import type { Exhibition } from "@/types";
import EditableCheckbox from "./EditableCheckbox";
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react";

interface EditExhibitionFormProps {
    initialData: Exhibition;
    onSave: (updatedData: Exhibition) => void;
    onCancel: () => void;
}

export default function EditExhibitionForm({
    initialData,
    onSave,
    onCancel,
}: EditExhibitionFormProps) {
    const isExhibitionEditing = Boolean(initialData._id);
    const [formData, setFormData] = useState<Exhibition>({
        ...initialData,
    });
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const origin = "USER";


    const handleSubmit = async () => {

        const newErrors: { [key: string]: string } = {};

        if (!formData.title?.trim()) newErrors.title = "Title is required.";
        if (!formData.date_end_st?.trim()) newErrors.date_end_st = "End date is required.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // onSave(formData);
            return;
        }

        const payload = { ...formData, origin };

        try {
            if (!formData._id) {
                const res = await fetch("/api/exhibitions/create-with-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                onSave?.(data);
            } else {
                const response = await fetch(`/api/exhibitions/${formData._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    onSave(formData);
                } else {
                    console.error("Update failed:", result.error);
                }
            }
        } catch (err) {
            console.error("Error updating exhibition", err);
        }
    }

    const handleUpload = async () => {

        if (!imageUrl) return;

        const response = await fetch("/api/exhibitions/upload-image", {
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
        setShowUploadPopup(false);
        setImageUrl("");
    };

    const toggleShow = async () => {
        const newShow = !formData.show;
        setFormData((prev) => ({ ...prev, show: newShow }));

        await fetch("/api/exhibitions/invalid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exhibitionId: formData._id, show: newShow }),
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
                    Save
                </button>
            </div>
        </div >
    );
}
