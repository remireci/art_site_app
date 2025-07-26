"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';


type Ad = {
    image_url: string;
    link: string;
    title: string;
};

type AdsColumnProps = {
    ads: Ad[];
}


const AdsColumn = ({ ads }: AdsColumnProps) => {

    const pathname = usePathname();
    const locale = pathname.split('/')[1];

    let optimizedUrl = '';

    // To refactor according to the ads objects

    // if (ads[0]) {
    //     const imageName = ads[0].split('?')[0].split('agenda/')[1];

    //     optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/format=auto,fit=cover,width=300/agenda/${encodeURI(imageName)}`;
    // } else {
    //     optimizedUrl = 'https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev/byArtNowDatabase_placeholder.png';

    // }

    return (
        <div className={`relative w-full aspect-[1]`}>
            <div
                className="flex flex-row flex-wrap md:flex-col justify-center md:items-end md:space-y-5 md:mt-28 space-x-2 md:space-x-0 ml-auto py-2 pl-1 md:pl-0 pr-1 w-full md:w-4/5 lg:w-3/5 md:max-w-[240px]"
            >
                {ads.map((ad, i) => (
                    <div
                        key={i}
                        className='flex justify-end items-center'>
                        <a href={`/${locale}/on-the-map`}>
                            <img
                                src={ad.image_url}
                                className="w-32 sm:w-30 md:w-40 lg:w-40 xl:w-52 2xl:w-60 h-auto"
                            />
                        </a>
                    </div>
                ))}

                {ads.map((ad, i) => (
                    <div
                        key={`dup-${i}`}
                        className='flex justify-end items-center'>
                        <a href={`/${locale}/on-the-map`}>
                            <img
                                src={ad.image_url}
                                className="w-32 sm:w-30 md:w-40 lg:w-40 xl:w-52 2xl:w-60 h-auto"
                            />
                        </a>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default AdsColumn;