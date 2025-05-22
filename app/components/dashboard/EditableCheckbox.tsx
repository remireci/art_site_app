"use client";
import { useState } from "react";

export default function EditableCheckbox({ label, checked: initialValue, onChange, tooltip }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    tooltip?: string;
}) {

    const [checked, setChecked] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        setChecked(newChecked);
        onChange(newChecked); // Send to backend
    };

    return (
        <label className="flex items-start gap-2 mb-3 group relative">
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className="mt-1"
            />
            <span>{label}</span>
            {tooltip && (
                <span className="absolute top-0 right-0 text-slate-500 text-xs hidden group-hover:block w-64 p-2 bg-white border rounded shadow-md">
                    {tooltip}
                </span>
            )}
        </label>
    );
}
