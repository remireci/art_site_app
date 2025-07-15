import { getTranslations } from "next-intl/server";


const Disclaimer = async () => {

    const t = await getTranslations('on-the-map');

    return (
        <div className="main-container flex flex-wrap min-h-screen overflow-auto">
            {/* <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40"></div>
            <div className="flex flex-col justify-between w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">

            </div>
            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">
                <div className='h-1/3 bg-slate-500'></div>
            </div> */}

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40">

            </div>

            <div className="flex flex-wrap justify-center w-full text-slate-800 px-1 mb-8 mt-2 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className='flex flex-col w-2/3 mx-6 mt-20 text-sm'>
                    <h2 className="uppercase mt-8">
                        {t("title")}
                    </h2>

                    <p className="mt-4">
                        {t("intro")}
                    </p>

                    <p className="mt-2">
                        {t("equality")}
                    </p>

                    <p className="mt-2">
                        {t("mosaic-promo")} <a href="/mosaic" className="underline">{t("visit-mosaic")}</a>
                    </p>

                    <p className="mt-2">
                        {t("updates")}
                    </p>

                    <hr className="my-6 border-t border-slate-300" />

                    <h3 className="mt-4 font-semibold">
                        {t("professionals-title")}
                    </h3>

                    <p className="mt-2">
                        {t("professionals-desc")}
                    </p>

                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>{t("request-login")}</li>
                        <li>{t("domain-match")}</li>
                        <li>
                            {t("once-logged-in")}<br />
                            <ul className="list-[circle] list-inside ml-4 space-y-1">
                                <li>{t("update-details")}</li>
                                <li>{t("manage-exhibitions")}</li>
                                <li>{t("paid-upgrades")}</li>
                            </ul>
                        </li>
                    </ul>

                    {/* <p className="mt-2">
                        {t("price-info")}
                    </p> */}

                    <hr className="my-6 border-t border-slate-300" />

                    <h3 className="mt-4 font-semibold">
                        {t("get-started")}
                    </h3>
                    <p className="mt-2">
                        {t("publish-help")} <a href="mailto:info@artnowdatabase.eu" className="font-semibold underline">info@artnowdatabase.eu</a>
                    </p>

                    <hr className="my-6 border-t border-slate-300" />

                    <p className="mt-2">
                        <strong>Art Now Database</strong> {t("mission")} <em>{t("mission-tagline")}</em>.
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
