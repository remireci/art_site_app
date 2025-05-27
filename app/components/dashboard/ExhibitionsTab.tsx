"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Exhibition } from "@/types";
import ExhibitionCard from "./ExhibitionCard";
import AddExhibitionButton from "./AddExhibitionButton";

interface Props {
    exhibitionsData: Exhibition[];
    locationData: any
}

export default function ExhibitionsTab({ exhibitionsData, locationData }: Props) {
    // const { location } = params;
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

    useEffect(() => {
        if (exhibitionsData && exhibitionsData.length > 0) {
            setExhibitions(exhibitionsData);
        }
    }, [exhibitionsData]);

    if (!exhibitionsData) {
        return notFound();
    }

    const handleUpdate = (updatedExhibition: Exhibition) => {
        setExhibitions(prev =>
            prev.map(ex =>
                ex._id === updatedExhibition._id ? updatedExhibition : ex
            )
        );
    };

    return (
        <div className="p-6 lg:max-w-3xl mx-auto text-slate-600">
            <div className="flex flex-col items-center justify-center mt-8">
                {exhibitionsData.length > 0 && exhibitionsData[0]?.url && exhibitionsData[0]?.location ? (
                    <p className="text-md hover:text-blue-800">
                        <a href={exhibitionsData[0].url} target="_blank" rel="noopener noreferrer">
                            {exhibitionsData[0].location}
                            {exhibitionsData[0].city && !["N/A", "null", "", "-", "Unknown"].includes(exhibitionsData[0].city) && (
                                <span className="text-sm">
                                    {" - "}{exhibitionsData[0].city.charAt(0).toUpperCase() + exhibitionsData[0].city.slice(1).toLowerCase()}
                                </span>
                            )}
                        </a>
                    </p>
                ) : (
                    <p className="text-gray-500">No data available</p>
                )}

                <div className="flex flex-col w-full mt-20 items-center">
                    <AddExhibitionButton
                        location={locationData.location}
                        domain={locationData.domain}
                        url={locationData.url}

                    />
                </div>

                <div className="w-auto px-4 mt-20 mb-4 bg-slate-200 text-sm text-slate-100 rounded flex items-center justify-center">
                    <p className="text-md uppercase text-gray-600">
                        Your actual exhibitions
                    </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2">
                    {exhibitions.map((exhibition, index) => (
                        <ExhibitionCard
                            key={exhibition._id}
                            exhibition={exhibition}
                            onUpdate={handleUpdate}
                            priority={index === 0}
                        />
                    ))}
                </ul>


                <div className="md:w-2/3 lg:w-1/3 text-slate-200 min-h-screen flex flex-col justify-end">
                </div>
            </div>
        </div >
    );
}