// components/Search.js
"use client"


const Disclaimer = () => {
    return (
        <div className="main-container flex flex-wrap">
            {/* <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40"></div>
            <div className="flex flex-col justify-between w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">

            </div>
            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">
                <div className='h-1/3 bg-slate-500'></div>
            </div> */}

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40">

            </div>

            <div className="w-full px-1 mb-8 mt-2 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className='flex flex-col justify-center mx-6 space-y-16 mt-20'>
                    <h2 className="text-2xl font-bold text-center text-gray-900">On the Map</h2>

                    <p className="text-lg text-center mt-4">
                        In the near future, you will be able to upload your exhibition data directly on this page.
                    </p>

                    <p className="mt-6">
                        <strong className="text-gray-900">Art Now Database</strong> follows a non-hierarchical approach to presenting exhibitions.
                        On the map, every institution is treated equally—just as in the mosaic, our <em>"random pic show"</em>.
                    </p>

                    <p className="mt-4">
                        We believe that art should be accessible to everyone.
                        That's why it only costs <span className="font-semibold text-gray-900">€50 per year</span> to present your exhibitions in the Art Exhibitions Calendar.

                        Meanwhile, you can contact us at: <strong><a href="mailto:info@artnowdatabase.eu">info@artnowdatabase.eu</a></strong>.
                    </p>
                    <p className="text-center mt-6 font-semibold text-lg text-gray-900">
                        Join us in making art more visible and inclusive!
                    </p>

                </div>

                <div className='results-container overflow-y-auto sm:mt-4'
                >
                </div>

                <div className="flex flex-col items-center w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">
                    {/* <div className='bg-amber-100 md-w-full h-40 w-4/5 border-t-4'></div>
                <div className='bg-green-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-indigo-500 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-pink-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-amber-100 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-green-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-indigo-500 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-pink-300 w-full h-40 md-w-1/2 border-t-4'></div> */}
                </div>

                <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block">

                </div>

                <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 "></div>

                <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 "></div>

                <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block"></div>

                <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 "></div>

                <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 "></div>
                {/* <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:w-1/3 lg:px-1 lg:my-1 xl:w-1/3 "></div> */}
            </div>
        </div>
    );
};

export default Disclaimer;
