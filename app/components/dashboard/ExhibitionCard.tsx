"use client";
import { useState } from "react";
import ExhibitionModal from "./ExhibitionModal";
import Image from "next/image";
import EditExhibitionForm from "./EditExhibitionForm";
import type { Exhibition } from "@/types";

export default function ExhibitionCard({ exhibition, priority, onUpdate }: { exhibition: Exhibition, priority?: boolean; onUpdate: (updated: Exhibition) => void; }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (updated: Exhibition) => {
        onUpdate(updated);
        setIsEditing(false);
    };

    let optimizedUrl;

    if (exhibition.image_reference[0]) {
        const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

        optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;

    } else {

        optimizedUrl = 'https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev/byArtNowDatabase_placeholder.png';

    }

    return (
        <li className="flex flex-col justify-between items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
            <h2 className="text-sm">{exhibition.title}</h2>
            <p className="text-xs">{exhibition.date_end_st}</p>

            <Image
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                unoptimized
                src={optimizedUrl}
                alt={exhibition.title}
                width={150}
                height={100}
                className="rounded-lg my-2"
            />


            <button
                onClick={() => setIsEditing(true)}
                className="shrink-0 text-sm h-6 mt-2 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
            >
                Edit
            </button>

            {isEditing && (
                <ExhibitionModal onClose={() => setIsEditing(false)}>
                    <EditExhibitionForm
                        initialData={exhibition}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                    />
                </ExhibitionModal>
            )}

        </li>
    );
}
