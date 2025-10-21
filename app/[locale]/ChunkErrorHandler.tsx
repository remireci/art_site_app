'use client';

import { useEffect, useState } from 'react';

export default function ChunkErrorHandler() {
    const [reconnecting, setReconnecting] = useState(false);

    useEffect(() => {
        console.log('✅ ChunkErrorHandler mounted');

        const reloadSafely = () => {
            const lastReload = sessionStorage.getItem('lastChunkReload');
            const now = Date.now();
            if (!lastReload || now - parseInt(lastReload) > 30000) {
                sessionStorage.setItem('lastChunkReload', now.toString());
                setReconnecting(true);
                setTimeout(() => window.location.reload(), 1500);
            }
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            const err = event.reason;
            if (err?.name === 'ChunkLoadError' || /Loading chunk \d+ failed/i.test(err?.message)) {
                console.warn('ChunkLoadError detected → reloading');
                reloadSafely();
            }
        };

        const handleError = (event: ErrorEvent) => {
            if (/Loading chunk \d+ failed/i.test(event?.message)) {
                console.warn('ChunkLoadError (ErrorEvent) detected → reloading');
                reloadSafely();
            }
        };

        window.addEventListener('unhandledrejection', handleRejection);
        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('unhandledrejection', handleRejection);
            window.removeEventListener('error', handleError);
        };
    }, []);

    if (!reconnecting) return null;


    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                zIndex: 9999,
                backdropFilter: 'blur(4px)',
                transition: 'opacity 0.3s ease',
            }}
        >
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-800/80 text-white px-4 py-2 rounded-xl shadow-lg text-sm flex items-center gap-2 backdrop-blur-md animate-fadeIn z-[9999]">
                <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <span>Reconnecting…</span>
            </div>

        </div>
    );
}
