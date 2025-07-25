"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize Supabase client
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_API_KEY
// );

const ImageDisplay = ({ imagePath, title, priority = false }) => {


    // const [imageUrl, setImageUrl] = useState('');

    // console.log("from ImageDisplay", imagePath);

    // useEffect(() => {
    //     const fetchImage = async () => {
    //         try {
    //             const { publicURL, error } = supabase.storage
    //                 .from('Exhibition')
    //                 .getPublicUrl(imagePath);

    //             if (error) throw error;

    //             // Add resizing parameters to the URL
    //             const transformedUrl = `${publicURL}?width=${width}&height=${height}`;
    //             setImageUrl(transformedUrl);
    //         } catch (error) {
    //             console.error("Error fetching image:", error);
    //         }
    //     };

    //     if (imagePath) {
    //         fetchImage();
    //     }
    // }, [imagePath, width, height]);

    // if (!imagePath || imagePath === "" || imagePath[0] === undefined) {
    //     return <p className='w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-400'>No image...</p>;  // You can customize this part to show a loading spinner, etc.
    // }

    // const imageName = imagePath.split('?')[0].split('/').pop();;



    // const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURIComponent(imageName)}`;

    // Get the full path after 'agenda/', and remove any query parameters

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

export default ImageDisplay;
