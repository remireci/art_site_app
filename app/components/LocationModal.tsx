"use client";

import { useState } from "react";

export default function Modal({ url, location }: { url: string; location: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-2xl underline text-blue-500 hover:text-blue-700">
                {location}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-red-500 text-xl font-bold"
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Leaving Our Site</h2>
                        <p className="mb-4">
                            You are about to visit <strong>{location}</strong>. Click "Continue" to proceed.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                                Cancel
                            </button>
                            <button onClick={handleOpen} className="px-4 py-2 bg-blue-600 text-white rounded">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
