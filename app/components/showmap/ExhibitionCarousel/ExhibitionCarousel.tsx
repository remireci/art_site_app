"use client"

import React, { useState } from 'react';
import Image from 'next/image';

interface MapProps {
    exhibitionsInLocation: Exhibition[];
}

type Exhibition = {
    _id: string;
    title?: string;
    date_end?: string;
    location?: string;
    url?: string;
    exh_url?: string;
    artists?: string;
    date_end_st: string;
    image_reference: string[];
}

const ExhibitionCarousel = ({ exhibitionsInLocation }: MapProps) => {
    const [currentExhibitionIndex, setCurrentExhibitionIndex] = useState(0);

    // console.log("exhibitions in location", exhibitionsInLocation);

    if (exhibitionsInLocation.length === 0) return null; // No exhibitions, return nothing

    const handleNextExhibition = () => {
        setCurrentExhibitionIndex((prevIndex) => (prevIndex + 1) % exhibitionsInLocation.length);
    };

    const handlePrevExhibition = () => {
        setCurrentExhibitionIndex((prevIndex) => (prevIndex - 1 + exhibitionsInLocation.length) % exhibitionsInLocation.length);
    };

    const formatDate = (dateStr: String) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className='w-[200px]'>
            {exhibitionsInLocation.map((exhibition, index) => (
                <div
                    key={exhibition._id}
                    style={{ display: index === currentExhibitionIndex ? "block" : "none" }}
                >
                    <h3 className="italic pt-2 leading-tight">{exhibition.title}</h3>
                    <div className='flex items-center justify-center bg-gray-300 backdrop-blur-sm'>
                        <Image
                            unoptimized
                            src={exhibition.image_reference[0]}
                            alt={exhibition.title || "No image available"}
                            width={200}
                            height={180}
                            className="w-full max-h-[150px] object-cover transition-transform duration-700 ease-in-out hover:scale-125"
                        />
                    </div>
                    <div className="flex flex-col space-y-1 overflow-visible">
                        {exhibitionsInLocation.length > 1 && (
                            <div className='flex flex-row justify-between font-bold mt-1' >
                                <button onClick={handlePrevExhibition}>&lt;</button>
                                <button onClick={handleNextExhibition}> &gt;</button>
                            </div>
                        )}

                        {exhibition.artists && exhibition.artists !== "N/A" &&
                            <p className='text-sm'>{exhibition.artists}</p>
                        }
                        {exhibition.location && exhibition.location !== "N/A" &&
                            <p className='text-sm'>{exhibition.location}</p>
                        }
                        <p className='text-xs'> &#8702; {formatDate(exhibition.date_end_st)}</p>
                        <a
                            href={exhibition.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        // className="text-blue-500 text-xs mt-1 inline-block z-10"
                        // style={{ position: "relative", zIndex: 10 }}
                        >
                            More Info
                        </a>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default ExhibitionCarousel;