"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);

const ImageDisplay = ({ imagePath, title, width, height }) => {
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
        <div className="grid gap-2 sm:gap-4 grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
            <div className="relative h-[400px]">
                <Image
                    src={imagePath}
                    alt={title}
                    width={120}
                    height={120}
                // style={{ objectFit: resizeMode }}
                />
            </div>
        </div>
    );
};

export default ImageDisplay;
