"use client"
import { useState, useEffect } from "react";

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);

    useEffect(() => {
        const storedConsent = localStorage.getItem("analyticsConsent");
        if (storedConsent !== null) {
            setAnalyticsConsent(storedConsent === "true");
        } else {
            // Wait for user interaction before showing banner
            const handleUserInteraction = () => {
                setShowBanner(true);
                document.removeEventListener("click", handleUserInteraction);
                document.removeEventListener("keydown", handleUserInteraction);
            };
            document.addEventListener("click", handleUserInteraction);
            document.addEventListener("keydown", handleUserInteraction);
        }
    }, []);

    const handleConsent = (analytics: boolean) => {
        setAnalyticsConsent(analytics);
        localStorage.setItem("analyticsConsent", analytics.toString());

        // Update Google Analytics consent
        window.gtag?.("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });

        setShowBanner(false);
        setShowSettings(false);
    };

    if (!showBanner || analyticsConsent !== null) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
            <div className="banner-slide-in bg-gray-800 text-slate-400 p-6 rounded-lg w-11/12 md:w-2/5 shadow-lg">
                {!showSettings ? (
                    <>
                        {/* Main Cookie Banner */}
                        <p className="text-center text-sm">
                            This site uses cookies for analytics and to improve user experience.
                            We currently use Google Analytics to track website traffic and performance.
                            <p className="text-sky-800 hover:text-sky-400 ml-1">
                                Check our Privacy Policy.
                            </p>
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button className="px-5 py-2 text-gray-500 border border-gray-600 rounded-md" onClick={() => setShowSettings(true)}>
                                Set Preferences
                            </button>
                            <button className="bg-gray-900 px-5 py-2 text-white rounded-lg" onClick={() => handleConsent(true)}>
                                Accept All
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Cookie Settings Panel */}
                        <p className="text-center text-sm">Select which cookies you want to allow:</p>
                        <div className="flex flex-col mt-3 gap-2">
                            <label className="flex items-center">
                                <input type="checkbox" checked={true} disabled className="mr-2" />
                                Essential Cookies (Always Enabled)
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={analyticsConsent ?? false}
                                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                                    className="mr-2"
                                />
                                Analytics Cookies (Google Analytics)
                            </label>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <button className="px-5 py-2 text-gray-500 border border-gray-600 rounded-md" onClick={() => handleConsent(false)}>
                                Save & Reject Analytics
                            </button>
                            <button className="bg-gray-900 px-5 py-2 text-white rounded-lg" onClick={() => handleConsent(true)}>
                                Save & Accept All
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}



// 'use client';
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { getLocalStorage, setLocalStorage } from '../lib/storageHelper';

// const CookieBanner = () => {
//     const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
//     const [isBannerVisible, setBannerVisible] = useState(false);

//     useEffect(() => {
//         const storedCookieConsent = getLocalStorage("cookie_consent", null);

//         if (storedCookieConsent !== null) {
//             setCookieConsent(storedCookieConsent);
//             setBannerVisible(false);
//         } else {
//             setBannerVisible(true);
//         }
//     }, []);

//     useEffect(() => {
//         if (cookieConsent !== null) {
//             const newValue = cookieConsent ? 'granted' : 'denied';

//             window.gtag && window.gtag("consent", 'update', {
//                 'analytics_storage': newValue
//             });

//             setLocalStorage("cookie_consent", cookieConsent);

//             // Hide the banner if consent is given or denied
//             setBannerVisible(false);

//         }
//     }, [cookieConsent]);

//     if (!isBannerVisible) return null;


//     return (
//         <div className="flex flex-row items-center">
//             <div className="banner-slide-in fixed bottom-0 flex flex-col md:flex-row w-full lg:w-2/5 h-10 justify-between items-center bg-gray-800 px-8 rounded-md z-50">
//                 <div className='text-center text-sm text-slate-400 py-6'>
//                     <p>Deze site gebruikt analytische cookies voor statistieken.
//                         <Link className="text-sky-800 hover:text-sky-400" rel="noopener noreferrer" target="_blank" href="/privacy#privacy"> Meer uitleg
//                         </Link>
//                     </p>
//                 </div>
//                 <div className='flex gap-2'>
//                     <button className='px-5 py-2 text-gray-500 rounded-md border-gray-900' onClick={() => setCookieConsent(false)}>Weigeren</button>
//                     <button className='bg-gray-900 px-5 py-2 text-white rounded-lg' onClick={() => setCookieConsent(true)}>Toestaan</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CookieBanner;