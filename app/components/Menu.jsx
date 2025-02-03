"use client"
// import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Menu = () => {
    const router = useRouter();


    return (
        <div>
            <div className="h-5"></div>
            <nav className="flex items-center text-sm md:text-lg space-x-6 md:space-x-12 mt-4">

                {/* <Link href="/minerals" className="hover:text-gray-600"> */}
                {/* Expositions */}
                {/* </Link> */}


                {/* <Link href="/account?message=wishlist"> */}
                <div className="relative hover:text-gray-600 cursor-pointer"
                >

                </div>
                {/* </Link> */}
                <button
                    className="relative hover:text-gray-400"
                >

                </button>
            </nav>

        </div>
    );
};

export default Menu;