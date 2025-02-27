import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bottom-0 w-full bg-slate-500 px-4 py-3 text-slate-100 font-extralight shadow-md">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">

                {/* Left Section */}
                <p className="text-xs">
                    © {new Date().getFullYear()}
                    <a
                        href="mailto:info@artnowdatabase.eu"
                        className="ml-2 hover:text-gray-400"
                    >
                        Art Now Database
                    </a>
                </p>

                {/* Center Section - Links stay in a row even on small screens */}
                <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                    <Link href="/privacy" className="text-xs hover:text-gray-400">
                        Your Privacy
                    </Link>

                    <Link href="/disclaimer" className="text-xs hover:text-gray-400">
                        Disclaimer
                    </Link>
                    {/* <Link href="/locations" className="text-xs text-slate-600">
                        Locations
                    </Link> */}
                </div>
            </div>
        </footer >
    );
};

export default Footer;
