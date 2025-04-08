"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import MosaicItem from "../../components/MosaicItem";

// Define the Exhibition type
interface Exhibition {
    title: string;
    location: string;
    url: string;
    image_reference: string[];
}
// Fisher-Yates shuffle to randomize exhibitions
const shuffleArray = (array: Exhibition[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function MosaicPage() {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [visibleExhibitions, setVisibleExhibitions] = useState<Exhibition[]>([]);
    const page = useRef(0);
    const loadingRef = useRef(false);

    // Fetch exhibitions and randomize
    useEffect(() => {
        async function fetchExhibitions() {
            const res = await fetch(`/api/exhibitions`);
            const data: Exhibition[] = await res.json();
            const filtered = data.filter(ex => ex.image_reference.length > 0);
            const shuffled = shuffleArray(filtered);

            setExhibitions(shuffled);
            setVisibleExhibitions(shuffled.slice(0, 100)); // Load more items at the start
        }
        fetchExhibitions();
    }, []);

    // Scroll event listener for infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (loadingRef.current) return;

            const scrollTop = window.innerHeight + document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollTop >= scrollHeight - 400) {
                loadingRef.current = true;
                page.current += 1;

                setTimeout(() => {
                    setVisibleExhibitions(prev => [
                        ...prev,
                        ...exhibitions.slice(page.current * 100, (page.current + 1) * 100), // Load more per scroll
                    ]);
                    loadingRef.current = false;
                }, 500);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [exhibitions]);

    return (
        <div className="mosaic-page">
            <motion.div
                className="relative w-full min-h-screen flex flex-col items-center overflow-y-auto"
                animate={{
                    background: [
                        "radial-gradient(circle, rgba(135,206,250,0.7) 0%, rgba(255,220,180,0.5) 50%, rgba(255,182,193,0.3) 100%)", // Light blue sky
                        "radial-gradient(circle, rgba(240,248,255,0.8) 0%, rgba(255,200,200,0.6) 50%, rgba(255,182,193,0.4) 100%)",
                        "radial-gradient(circle, rgba(173,216,230,0.9) 0%, rgba(255,240,200,0.7) 50%, rgba(255,218,185,0.5) 100%)"
                    ],
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
            >
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 w-full p-4">
                    {visibleExhibitions.map((exhibition, index) => (
                        <MosaicItem key={index} exhibition={exhibition} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
