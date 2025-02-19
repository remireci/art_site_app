import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import MosaicItem from "./MosaicItem";

interface Exhibition {
    title: string;
    location: string;
    url: string;
    image_reference: string;
}

const shuffleArray = (array: Exhibition[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function MosaicTab({ exhibitions }: { exhibitions: Exhibition[] }) {
    const [showExhibitions, setShowExhibitions] = useState<Exhibition[]>([]);
    const [visibleExhibitions, setVisibleExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);
    const page = useRef(0);
    const loadingRef = useRef(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        async function fetchExhibitions() {
            // const res = await fetch(`/api/exhibitions`);
            // const data: Exhibition[] = await res.json();
            const filtered = exhibitions.filter(ex => ex.image_reference.length > 0);
            const shuffled = shuffleArray(filtered);

            setShowExhibitions(shuffled);
            setVisibleExhibitions(shuffled.slice(0, 100));
            setLoading(false)
        }
        fetchExhibitions();
    }, [exhibitions]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingRef.current) {
                    loadingRef.current = true;
                    page.current += 1;

                    setTimeout(() => {
                        setVisibleExhibitions(prev => [
                            ...prev,
                            ...showExhibitions.slice(page.current * 100, (page.current + 1) * 100),
                        ]);
                        loadingRef.current = false;

                    }, 300);
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [showExhibitions]);

    return (
        <div className="mosaic-page">
            {loading ? ( // 🔹 Show only while fetching the first batch
                <div className="text-center text-gray-500 py-10 animate-pulse">
                    Loading exhibitions...
                </div>
            ) : (
                <motion.div
                    className="w-full flex flex-col items-center"
                    animate={{
                        background: [
                            "radial-gradient(circle, rgba(135,206,250,0.7) 0%, rgba(255,220,180,0.5) 50%, rgba(255,182,193,0.3) 100%)",
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
                    <div ref={loadMoreRef} className="h-10" /> {/* Load more trigger */}
                </motion.div>
            )}
        </div>
    );
}
