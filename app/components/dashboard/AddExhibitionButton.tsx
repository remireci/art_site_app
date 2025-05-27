"use client";
import { useState } from "react";
import EditExhibitionForm from "./EditExhibitionForm";
import { Exhibition } from "@/types";

interface Props {
    location: string;
    domain: string;
    url: string;
}

export default function AddExhibitionButton({ location, domain, url }: Props) {
    const [isAdding, setIsAdding] = useState(false);

    if (isAdding) {
        return (
            <EditExhibitionForm
                initialData={{ title: "", date_end_st: "", location: `${location}`, url: `${url}`, domain: `${domain}`, image_reference: [""], show: true }}
                onSave={(newData) => {
                    console.log("Add", newData);
                    setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
            />
        );
    }

    return (

        <button
            onClick={() => setIsAdding(true)}
            className="shrink-0 text-sm h-6 bg-[#87bdd8] hover:bg-blue-700 text-slate-100 px-4 rounded flex items-center justify-center text-md uppercase"
        >
            + Add Exhibition
        </button>
    );
}
