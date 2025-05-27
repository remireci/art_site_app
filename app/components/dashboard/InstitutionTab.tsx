"use client";
import { useEffect, useState } from "react";
import EditableField from "./EditableField";
import EditableCheckbox from "./EditableCheckbox";
import { Exhibition } from "@/types";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface Props {
    locationData: any
}

export default function InstitutionTab({ locationData }: Props) {
    const [data, setData] = useState<null | {
        user: { email: string; name?: string; role?: string };
        location: any;
    }>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("../api/dashboard")
            .then((res) => res.json())
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);


    const handleFieldChange = (
        section: "user" | "location",
        field: string,
        value: string
    ) => {
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            };
        });
    };


    if (loading) return <div className="p-4 text-slate-600">Loading dashboard...</div>;
    if (!data) return <div className="p-4 text-red-600">Failed to load data.</div>;

    const preferredOrder = [
        "location",
        "description",
        "city",
        "mail",
        "address",
        "phone",
        "url",
        "exhibitions_url",
        "check_coordinates",
        "show",
    ];

    const { user, location } = data;


    return (
        <div className="p-6 lg:max-w-3xl mx-auto text-slate-600">
            <div className="flex flex-col justify-center">
                {/* <h1 className="text-lg font-semibold">Dashboard</h1> */}
                <p className="text-sm text-slate-500 mt-1 mb-8">
                    Please review and update your institution&apos;s details below. <br />
                    Accurate and complete information ensures your events are correctly displayed and discoverable on ArtNowDatabase.
                </p>


                <section className="mb-6">
                    <h2 className="mb-4 underline">User info</h2>
                    <div className="ml-4">
                        <EditableField label="Email" value={user.email} field="email" section="user" readOnly />
                        <EditableField label="Name" value={user.name || "......"} field="name" section="user" onChange={(val) => handleFieldChange("user", "name", val)} />
                        <EditableField label="Role" value={user.role || "......"} field="role" section="user" onChange={(val) => handleFieldChange("user", "role", val)} />
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 underline">Institution Info</h2>
                    <div className="ml-4 flex flex-col gap-2">
                        {preferredOrder
                            .filter(key => !["_id", "domain", "coordinates", "exhibitions_last_checked", "slug"].includes(key))
                            .map((key) => {
                                const value = location[key];
                                const stringValue = typeof value === "object"
                                    ? JSON.stringify(value, null, 2)
                                    : String(value ?? "");

                                // Special field cases remain the same...
                                switch (key) {
                                    case "url":
                                        return (
                                            <div key={key} className="flex items-center gap-2">
                                                <EditableField
                                                    label="Website URL"
                                                    value={stringValue}
                                                    field={key}
                                                    section="location"
                                                    readOnly
                                                />
                                                <span
                                                    title="To update this address, please contact info@artnowdatabase.eu"
                                                    className="cursor-help text-slate-400"
                                                >
                                                    ⓘ
                                                </span>
                                            </div>
                                        );

                                    case "exhibitions_url":
                                        return (
                                            <div key={key}>
                                                <label className="block font-medium italic text-slate-400 mb-2">
                                                    Exhibition Listings
                                                </label>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {/* {stringValue
                                                        ? "ArtNowDatabase automatically checks this URL for current exhibitions. Please edit if incorrect:"
                                                        : "Please provide the URL where we can find your current exhibitions:"}
                                                         */}
                                                    Choose how you&apos;d like to keep your exhibitions up to date.
                                                </p>
                                                {!location.disable_scraping && (
                                                    <>
                                                        <p className="text-sm text-slate-500 mt-1 mb-2">
                                                            Please provide the exact URL of the page where your current exhibitions are listed.
                                                            ArtNowDatabase will regularly check this page and update your exhibitions automatically:
                                                        </p>
                                                        <EditableField
                                                            label=""
                                                            value={stringValue || "......"}
                                                            field={key}
                                                            section="location"
                                                            onChange={(val) => handleFieldChange("location", key, val)}
                                                        />
                                                    </>
                                                )}
                                                <p className="text-sm text-slate-500 mt-1 mb-2">
                                                    If you prefer to manage exhibition details yourself, check the box below.
                                                    This gives you full control, but please remember to update your exhibitions regularly.
                                                </p>
                                                <EditableCheckbox
                                                    label="I prefer to enter exhibitions manually"
                                                    checked={location.disable_scraping ?? false}
                                                    onChange={(checked) => {
                                                        setData((prev) => {
                                                            if (!prev) return prev;
                                                            return {
                                                                ...prev,
                                                                location: {
                                                                    ...prev.location,
                                                                    disable_scraping: checked,
                                                                },
                                                            };
                                                        });
                                                        fetch("/api/dashboard/update", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ section: "location", field: "disable_scraping", value: checked }),
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );

                                    case "check_coordinates":
                                        return (
                                            <div key={key}>
                                                <label className="block font-medium italic text-slate-400 mb-1">
                                                    On The Map
                                                </label>
                                                <EditableCheckbox
                                                    key={key}
                                                    label="Is your institution not localized correctly on the map? Please update your address and check this box. Our system will update the location automatically."
                                                    checked={Boolean(value)}
                                                    onChange={(checked) => {
                                                        fetch("/api/dashboard/update", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ section: "location", field: "check_coordinates", value: checked }),
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );

                                    case "show":
                                        return (
                                            <div key={key} className="mt-8">
                                                <label className="block font-medium italic text-red-400">
                                                    Remove my institution
                                                </label>
                                                <EditableCheckbox
                                                    key={key}
                                                    label="Don't show my institution on ArtNowDatabase"
                                                    checked={!value}
                                                    onChange={(checked) => {
                                                        // Send update: show = !checked
                                                        fetch("/api/dashboard/update", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ section: "location", field: "show", value: !checked }),
                                                        });
                                                    }}
                                                />
                                            </div>
                                        );

                                    default:
                                        return (
                                            <EditableField
                                                key={key}
                                                label={capitalizeFirstLetter(key)}
                                                value={!stringValue || stringValue === "null" ? "......" : stringValue}
                                                field={key}
                                                section="location"
                                                multiline={stringValue.length > 100}
                                                onChange={(val) => handleFieldChange("location", key, val)}
                                            />
                                        );
                                }
                            })}
                    </div>
                </section>
            </div>
        </div >
    );
}