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

    if (!imagePath || imagePath === "") {
        return <p>Loading image...</p>;  // You can customize this part to show a loading spinner, etc.
    }

    return (
        <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
            {/* <div className="relative h-[100px]"> */}
            <Image
                unoptimized
                src={imagePath}
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
