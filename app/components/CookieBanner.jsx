'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CookieBanner = () => {
    const [onHomePage, setOnHomePage] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const currentPathname = usePathname();


    useEffect(() => {
        // Check if the pathname is "/"
        const isHomePage = currentPathname === "/";
        setOnHomePage(isHomePage);

        const showTimeout = setTimeout(() => {
            setShowBanner(true);
        }, 500);

        return () => clearTimeout(showTimeout); // Clean up the timeout on unmount
    }, []);

    const handleHideBanner = () => {

        setShowBanner(false);
    };


    return (
        <div className="flex flex-row items-center">
            {onHomePage && showBanner && (
                <div className="banner-slide-in fixed bottom-0 flex flex-col md:flex-row w-full lg:w-2/5 h-10 justify-between items-center bg-gray-800 px-8 rounded-md z-50">
                    <div className='text-center text-sm text-slate-400 py-6'>
                        <p>Deze site gebruikt analytische cookies voor statistieken.
                            <Link className="text-sky-800 hover:text-sky-400" href="/privacy#privacy" onClick={handleHideBanner}> Meer uitleg
                            </Link>
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <button className="absolute top-0 right-0 text-lg text-slate-400 hover:text-white bg-transparent py-1 px-2 border-none cursor-pointer" onClick={handleHideBanner}>
                            &#10005;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CookieBanner;