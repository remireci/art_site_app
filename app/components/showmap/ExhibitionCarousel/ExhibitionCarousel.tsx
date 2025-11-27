"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getOptimizedSrc } from '@/utils/getOptimizedSrc';


interface MapProps {
    exhibitionsInLocation: Exhibition[];
    slug: string;
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
    exhibition_url: string;
}



const ExhibitionCarousel = ({ exhibitionsInLocation, slug }: MapProps) => {
    const BASE_URL =
        process.env.NODE_ENV === "production"
            ? "https://www.artnowdatabase.eu"
            : "http://localhost:3000";

    const pathname = usePathname();
    const locale = pathname.split('/')[1];

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
        <div className="w-[200px] min-h-[280px]">
            {exhibitionsInLocation.map((exhibition, index) => {



                const URL = slug ? `${BASE_URL}/${locale}/exhibitions/locations/${slug}` : exhibition.url;

                // const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

                const optimizedUrl = getOptimizedSrc(exhibition.image_reference[0]);

                return (
                    <div
                        key={exhibition._id}
                        style={{ display: index === currentExhibitionIndex ? "block" : "none" }}
                        className="flex flex-col justify-between h-full"
                    >
                        <h3
                            title={exhibition.title}
                            className="italic pt-2 leading-tight text-ellipsis overflow-hidden whitespace-nowrap"
                        >

                            {exhibition.title}
                        </h3>

                        <div className="flex items-center justify-center bg-gray-300 backdrop-blur-sm h-[140px] overflow-hidden">
                            <Image
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                unoptimized
                                src={optimizedUrl}
                                alt={exhibition.title || "No image available"}
                                width={200}
                                height={180}
                                className="w-full max-h-[150px] object-cover transition-transform duration-700 ease-in-out hover:scale-125"
                            />
                        </div>
                        <div className="flex flex-col -space-y-1 leading-none">
                            {exhibitionsInLocation.length > 1 && (
                                <div className='flex flex-row justify-between font-bold mt-1' >
                                    <button onClick={handlePrevExhibition}>&lt;</button>
                                    <button onClick={handleNextExhibition}> &gt;</button>
                                </div>
                            )}
                            <div className="flex flex-col -space-y-8 leading-none">
                                {exhibition.artists && exhibition.artists !== "N/A" && (
                                    <p className="text-sm leading-tight overflow-hidden text-ellipsis line-clamp-2">
                                        {exhibition.artists}
                                    </p>

                                )}
                                <div className="flex flex-col -space-y-4 h-1/2">
                                    {exhibition.location && exhibition.location !== "N/A" && (
                                        <p className="text-sm">
                                            <a
                                                // href={
                                                //     exhibition.exhibition_url && exhibition.exhibition_url !== 'N/A'
                                                //     ? exhibition.exhibition_url
                                                //     : exhibition.url
                                                // }
                                                href={URL}
                                                target="_blank" rel="noopener noreferrer"
                                            >
                                                {exhibition.location}
                                            </a>
                                        </p>
                                    )}
                                    <p className="text-xs">&#8702; {formatDate(exhibition.date_end_st)}</p>
                                </div>
                            </div>
                            {/* {exhibition.artists && exhibition.artists !== "N/A" &&
                            <p className='text-sm'>{exhibition.artists}</p>
                        }
                        {exhibition.location && exhibition.location !== "N/A" &&
                            <a
                                href={exhibition.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            // className="text-blue-500 text-xs mt-1 inline-block z-10"
                            // style={{ position: "relative", zIndex: 10 }}
                            >
                                <p className='text-sm'>{exhibition.location}</p>
                            </a>
                        }
                        <p className='text-xs'> &#8702; {formatDate(exhibition.date_end_st)}</p> */}
                        </div>
                    </div>
                )
            })
            }

        </div >
    );
};

export default ExhibitionCarousel;