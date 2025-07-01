"use client";
import { useState } from "react";
import ExhibitionModal from "./ExhibitionModal";
import Image from "next/image";
import EditExhibitionForm from "./EditExhibitionForm";
import type { Exhibition } from "@/types";
import EditExhibitionImage from "./EditExhibitionImage";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";


export default function ExhibitionCard({ exhibition, priority, onUpdate }: { exhibition: Exhibition, priority?: boolean; onUpdate: (updated: Exhibition) => void; }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingImage, setIsEditingImage] = useState(false);

    const handleSave = (updated: Exhibition) => {

        console.log("from the CARD, the updated", updated);
        setIsEditing(false);
        onUpdate(updated);
    };

    const handleUpdate = (updated: Exhibition) => {
        onUpdate(updated); // passes to parent
        setIsEditingImage(false); // closes modal if open
    };

    let optimizedUrl;

    if (exhibition.image_reference && exhibition.image_reference[0]) {
        const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

        optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;

    } else {

        optimizedUrl = 'https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev/byArtNowDatabase_placeholder.png';

    }


    return (
        <li className="flex flex-col justify-start items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
            <h2 className="text-sm whitespace-nowrap overflow-hidden truncate w-full">{exhibition.title}</h2>
            <p className="text-xs">{exhibition.date_end_st}</p>

            {exhibition.image_reference && !exhibition.image_reference[0] && (
                <TooltipProvider>
                    <div className="flex items-center gap-1 text-red-500 text-xs italic">
                        <span>No image</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                This exhibition won’t appear publicly until an image is uploaded.
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            )}

            <Image
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                unoptimized
                src={optimizedUrl}
                alt={exhibition.title || ""}
                width={150}
                height={100}
                className="rounded-lg my-2"
            />

            {
                (!exhibition.show && exhibition.image_reference) && <p className="text-red-500 text-xs italic">
                    Hidden
                </p>
            }


            <button
                onClick={() => setIsEditing(true)}
                className="shrink-0 text-sm h-6 mt-2 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
            >
                Edit
            </button>

            {/* adding edit and add image buttons = overload */}
            {/* {
                !exhibition.image_reference[0] && (
                    <div>
                        <button
                            onClick={() => setIsEditingImage(true)}
                            className="shrink-0 text-sm h-6 mt-2 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
                        >
                            Add Image
                        </button>
                    </div>
                )
            }

            {
                exhibition.image_reference[0] && (
                    <button
                        onClick={() => setIsEditingImage(true)}
                        className="shrink-0 text-sm h-6 mt-2 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
                    >
                        Edit Image
                    </button>
                )
            } */}

            {
                isEditingImage && (
                    <ExhibitionModal onClose={() => setIsEditingImage(false)}>
                        <EditExhibitionImage
                            exhibition={exhibition}
                            onClose={() => setIsEditingImage(false)}
                            onImageUpdate={handleUpdate}
                        />
                    </ExhibitionModal>
                )
            }

            {
                isEditing && (
                    <ExhibitionModal onClose={() => setIsEditing(false)}>
                        <EditExhibitionForm
                            initialData={exhibition}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    </ExhibitionModal>
                )
            }

        </li >
    );
}
