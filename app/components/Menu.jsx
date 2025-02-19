"use client"
// import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Menu = () => {
    const router = useRouter();


    return (
        <div className="flex flex-col justify-end">
            <nav className="flex items-center text-sm md:text-lg space-x-6 md:space-x-12 my-4 text-slate-500 hover:text-gray-600">
                <Link href="/on-the-map">
                    <h2 className='text-center text-sm font-light underline'>On the map</h2>
                </Link>

                <Link href="/advertising">
                    <h2 className='text-center text-sm font-light underline'>Advertising</h2>
                </Link>
                {/* <Link href="/account?message=wishlist"> */}
                {/* <div className="relative hover:text-gray-600 cursor-pointer"
                >

                </div> */}
                {/* </Link> */}
                {/* <button
                    className="relative hover:text-gray-400"
                >

                </button> */}
            </nav>

        </div>
    );
};

export default Menu;