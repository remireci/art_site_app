"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize Supabase client
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_API_KEY
// );

const ImageDisplay = ({ imagePath, title, width = 120, height = 120 }) => {
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

    if (!imagePath || imagePath === "" || imagePath[0] === undefined) {
        return <p>Loading image...</p>;  // You can customize this part to show a loading spinner, etc.
    }

    console.log(imagePath);

    // const imageName = imagePath.split('?')[0].split('/').pop();;



    // const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURIComponent(imageName)}`;

    // Get the full path after 'agenda/', and remove any query parameters
    const imageName = imagePath.split('?')[0].split('agenda/')[1];

    // Construct the Cloudflare optimized URL
    const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName)}`;

    console.log("optimized", optimizedUrl);

    return (
        <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
            {/* <div className="relative h-[100px]"> */}
            <Image
                unoptimized
                src={optimizedUrl}
                alt={title}
                layout="fill" // This ensures the image fills the container
                objectFit="contain" // Ensures the image fits within the dimensions
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize based on screen size
                className="transition-transform duration-700 ease-in-out hover:scale-[1.4] hover:z-10"
            />
            {/* </div> */}
        </div>
    );
};

export default ImageDisplay;
