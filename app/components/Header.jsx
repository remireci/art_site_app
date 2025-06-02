"use client"
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import Menu from "./Menu";
import { useTranslations } from "next-intl";

const Header = () => {
    const t = useTranslations();
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    // Reset menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowMenu(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Function to hide the menu on small screens

    return (
        <header className="flex flex-wrap overflow-hidden h-26 md:h-20 bg-stone-50">
            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block"></div>
            <div className="flex flex-wrap justify-center w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className="bg-orange-400 mb-16 md:mb-0 pt-4 pb-3 px-8 flex flex-col md:flex-row justify-between items-center">
                    {/* this div is made invisible for the moment */}
                    {/* <div className="text-stone-50 px-1 py-1"> */}
                    {/* <Link href="/"> */}
                    {/* <h1 className="text-base font-medium hover:text-gray-400">&lt; Demo Web Shop &gt;</h1>
                        <p className="text-sm font-thin">by reciproque</p> */}
                    {/* </Link> */}
                    {/* <a href="mailto:reci.reciproque@gmail.com" className="text-sm font-thin hover:text-gray-400">
                        contact
                    </a> */}
                    {/* </div> */}
                    <div className='absolute top-0 md:top-8 brightness-85 contrast-75 transition duration-1000 ease-in-out'>
                        <div className="mt-0 md:-mt-8 lineUp flex flex-col items-center text-slate-400 p-4 w-fit">
                            <Link href="/">
                                <span className="text-center font-semibold text-lg md:text-2xl tracking-widest uppercase hover:text-gray-600">
                                    {/* Art Exhibitions Calendar */}
                                    {t("homepage.title")}
                                </span>
                            </Link>
                            <h2 className='text-center text-xs font-light'>by Art Now Database</h2>
                            {/* <p className='text-center text-xs uppercase font-light decoration-double'>&lt; webshop &gt;</p> */}
                        </div>

                    </div>
                </div>
                <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 ">
                </div >
            </div>




            <div className="flex flex-col items-center justify-end w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">
                {/* Hamburger menu icon */}
                <div className="absolute top-5 left-5 lg:hidden cursor-pointer text-slate-400" onClick={toggleMenu}>
                    <FiMenu size={24} />
                </div>
                {/* Navigation menu for small screens */}
                {
                    showMenu && (
                        <div ref={menuRef} className="absolute top-12 left-0 w-full bg-slate-50 shadow-lg p-1 lg:hidden z-40">
                            <nav className="flex flex-col mx-4 space-y-4">
                                <Menu />
                            </nav>
                        </div>
                    )
                }

                {
                    !showMenu && (
                        <div className="hidden lg:block">
                            <Menu />
                        </div>
                    )
                }


            </div>
        </header >
    );
};

export default Header;