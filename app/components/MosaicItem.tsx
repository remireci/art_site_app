"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface MosaicItemProps {
    exhibition: {
        title: string;
        location: string;
        url: string;
        image_reference: string[];
        exhibition_url: string;
    };
}

export default function MosaicItem({ exhibition }: MosaicItemProps) {

    // const number_of_pictures = exhibition.image_reference.length + 1;
    // const index_picture = Math.floor(Math.random() + number_of_pictures);
    // const picture_src = exhibition.image_reference[index_picture]

    // console.log("the exhibition", exhibition)

    const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

    // Construct the Cloudflare optimized URL
    const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,quality=70,fit=cover,format=auto/agenda/${encodeURI(imageName as string)}`;


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
            className="relative w-full h-40 group"
        >
            <Link href={exhibition.exhibition_url && exhibition.exhibition_url !== null
                ? exhibition.exhibition_url
                : exhibition.url
            }
                target="_blank"
            >

                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[8px] px-1 truncate opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 z-20">
                    <p>{exhibition.title}</p>
                    <p>{exhibition.location}</p>
                </div>

                {/* <div className="w-full h-full object-cover rounded-md shadow-md overflow-hidden"> */}
                <div className={`relative w-full aspect-[1]`}>
                    <Image
                        unoptimized
                        src={optimizedUrl}
                        alt={exhibition.title}
                        layout="fill"
                        objectFit="cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        className="transition-transform duration-700 ease-in-out group-hover:scale-[2.5] group-hover:z-10"
                    />
                </div>

            </Link>
        </motion.div>
    );
}
