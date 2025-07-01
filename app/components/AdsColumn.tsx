"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';


const AdsColumn = () => {

    const SHOW_ADS = false;

    if (!SHOW_ADS) {
        return null;
    }

    let optimizedUrl = '';

    if (imagePath[0]) {
        const imageName = imagePath.split('?')[0].split('agenda/')[1];

        optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/format=auto,fit=cover,width=300/agenda/${encodeURI(imageName)}`;
    } else {
        optimizedUrl = 'https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev/byArtNowDatabase_placeholder.png';

    }

    return (
        <div className={`relative w-full aspect-[1]`}>
            {/* <div className="relative h-[100px]"> */}
            <Image
                unoptimized
                priority={priority}
                src={optimizedUrl}
                alt={title}
                fill
                placeholder='blur'
                blurDataURL='/placeholder.png'
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-700 ease-in-out hover:scale-[1.4] hover:z-10"
            />
            {/* </div> */}
        </div>
    );
};

export default AdsColumn;