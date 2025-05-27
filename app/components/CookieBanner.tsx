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
                            By logging in, a necessary session cookie will be stored in your browser to keep you authenticated during your visit. This is required for secure access and is not used for tracking.
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


// @TODO: implement simplified version below for users that login.

// 'use client';

// import { usePathname } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const pathsRequiringBanner = ['/login', '/register'];

// export default function CookieBanner() {
//   const pathname = usePathname();
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const hasDismissed = localStorage.getItem('cookie-banner-dismissed');
//     if (!hasDismissed && pathsRequiringBanner.includes(pathname)) {
//       setVisible(true);
//     }
//   }, [pathname]);

//   const handleClose = () => {
//     localStorage.setItem('cookie-banner-dismissed', 'true');
//     setVisible(false);
//   };

//   if (!visible) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-sm p-4 flex items-center justify-between z-50">
//       <p>
//         We use a functional cookie to support login. This cookie is essential and does not track you.
//       </p>
//       <button
//         className="ml-4 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
//         onClick={handleClose}
//       >
//         Close
//       </button>
//     </div>
//   );
// }
