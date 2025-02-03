"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface MosaicItemProps {
    exhibition: {
        title: string;
        location: string;
        url: string;
        image_reference: string;
    };
}

export default function MosaicItem({ exhibition }: MosaicItemProps) {

    const number_of_pictures = exhibition.image_reference.length + 1;
    const index_picture = Math.floor(Math.random() + number_of_pictures);
    const picture_src = exhibition.image_reference[index_picture]

    console.log("this is the picture source", picture_src);


    return (
        <motion.div
            initial={{
                opacity: 0,
                x: Math.random() * 1000 - 500,
                y: Math.random() * 1000 - 500,
                rotate: Math.random() * 360,
                scale: 0.3,
            }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
            }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="relative w-full h-40"
        >
            <Link href={exhibition.url} target="_blank">
                <div className="w-full h-full object-cover rounded-md shadow-md">
                    <div className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110">
                        <Image
                            src={exhibition.image_reference[0]}
                            alt={exhibition.title}
                            layout="fill"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={true} // Loads images faster
                            loading="eager"
                        />
                    </div>
                </div>
                {/* <img
                    src={exhibition.image_reference}
                    alt={exhibition.title}
                    className="w-full h-full rounded-lg shadow-lg"
                /> */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[8px] px-1 truncate">
                    <p>{exhibition.title}</p>
                    <p>{exhibition.location}</p>
                </div>
            </Link>
        </motion.div>
    );
}
