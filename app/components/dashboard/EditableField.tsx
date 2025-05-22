"use client";

import { useState } from "react";

interface Props {
    label: string;
    value: string;
    field: string;
    section: "user" | "location";
    readOnly?: boolean;
    multiline?: boolean;
    onChange?: (newValue: string) => void;
}

export default function EditableField({ label, value, field, section, readOnly, multiline, onChange }: Props) {
    const [editing, setEditing] = useState(false);
    const [newValue, setNewValue] = useState(value === "......" ? "" : value);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const startEditing = () => {
        setNewValue(value === "......" ? "" : value);
        setEditing(true);
    };

    const save = async () => {
        setSaving(true);
        setError("");

        const previousValue = value;
        const optimisticValue = newValue;
        if (onChange) onChange(optimisticValue);
        setEditing(false);

        try {
            const res = await fetch(`/api/dashboard/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section, field, value: newValue }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update.");
            }
            setEditing(false);
        } catch (err: any) {
            setError(err.message);
            setEditing(true);
            setNewValue(previousValue);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block font-medium italic text-slate-400">{label}</label>
            {editing && !readOnly ? (
                <div className="flex flex-col gap-2">
                    {multiline ? (
                        <textarea
                            className="border p-2 w-full rounded"
                            rows={4}
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    ) : (
                        <input
                            // className="border p-2 w-full rounded"
                            className="bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={save}
                            disabled={saving}
                            // className="px-3 py-1 bg-blue-600 text-white rounded"
                            className="w-30 h-8 bg-[#87bdd8] hover:bg-blue-700 text-slate-100 mx-1 px-4 rounded-xl flex items-center justify-center"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded">
                            Cancel
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
            ) : (
                <div className="flex justify-between items-center gap-2">
                    <div className="min-w-0"> {/* Add min-width: 0 to enable text truncation */}
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-800 hover:text-blue-400 hover:underline break-all"
                        >
                            {value}
                        </a>
                    </div>
                    {!readOnly && (
                        <button
                            onClick={startEditing}
                            className="shrink-0 text-sm h-6 px-2 rounded bg-gray-200 text-gray-800 border-2 border-blue-200 hover:bg-blue-800"
                        >
                            Edit
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
