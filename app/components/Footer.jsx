import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bottom-0 flex flex-row mt-auto h-15 w-full bg-slate-500 px-1 py-3 text-slate-100 font-extralight shadow-md">
            <div className="container mx-auto w-1/3 h-5 flex flex-col md:flex-row items-end justify-between">
                <div className="text-center">
                    <p className="text-xs">© {new Date().getFullYear()}
                        <a
                            href="mailto:info@artnowdatabase.eu"
                            className='ml-2 hover:text-gray-400'
                        >
                            Art Now Database
                        </a>
                    </p>
                </div>
                <div className="mt-2 md:mt-0 h-5 flex items-end space-x-12 md:space-x-12">

                    <Link href="/privacy">
                        <p className="text-xs hover:text-gray-400">Your Privacy</p>
                    </Link>
                    <div className='flex space-x-2' >


                        <p className="text-center md:text-left text-xl">


                        </p>
                        <p className="text-center md:text-left text-xl">

                        </p>
                    </div>

                </div>
            </div>
            <div>
                <Link href="/locations">
                    <p className="text-xs text-slate-600">Locations</p>
                </Link>

            </div>

        </footer >
    );
};

export default Footer;
