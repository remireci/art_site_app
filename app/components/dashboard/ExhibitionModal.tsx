"use client";

import { ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-full max-w-md p-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}
