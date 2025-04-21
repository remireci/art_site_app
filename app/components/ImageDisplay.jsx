"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Head from 'next/head';

// Initialize Supabase client
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_API_KEY
// );

const ImageDisplay = ({ imagePath, title, priority = false, index = 0 }) => {

    const [isInViewport, setIsInViewport] = useState(false);
    // Get the full path after 'agenda/', and remove any query parameters
    const imageName = imagePath.split('?')[0].split('agenda/')[1];

    // Construct the Cloudflare optimized URL
    const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,quality=70,fit=cover,format=auto/agenda/${encodeURI(imageName)}`;

    useEffect(() => {
        // Preload the first 2 images based on the priority
        if (priority) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = optimizedUrl;
            preloadLink.as = 'image';
            document.head.appendChild(preloadLink);
        }

        // Intersection Observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInViewport(true);
                }
            },
            { threshold: 0.1 } // Trigger once 10% of the image is visible
        );

        observer.observe(document.querySelector(`#image-${index}`));

        return () => observer.disconnect();
    }, [priority, index, optimizedUrl]);
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
        return <p className='w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-400'>No image...</p>;  // You can customize this part to show a loading spinner, etc.
    }

    // const imageName = imagePath.split('?')[0].split('/').pop();;



    // const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURIComponent(imageName)}`;



    return (
        <>
            <Head>
                {/* Preload the images with priority (first 2 images) */}
                {priority && (
                    <link rel="preload" href={optimizedUrl} as="image" />
                )}
            </Head>
            <div id={`image-${index}`} className={`relative w-full aspect-[1]`}>
                {/* <div className="relative h-[100px]"> */}
                <Image
                    unoptimized
                    priority={priority}
                    src={optimizedUrl}
                    alt={title}
                    layout="fill" // This ensures the image fills the container
                    objectFit="cover" // Ensures the image fits within the dimensions
                    placeholder='blur'
                    blurDataURL='"/placeholder.png'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize based on screen size
                    className="transition-transform duration-700 ease-in-out hover:scale-[1.4] hover:z-10"
                />
                {/* </div> */}
            </div>
        </>
    );
};

export default ImageDisplay;
