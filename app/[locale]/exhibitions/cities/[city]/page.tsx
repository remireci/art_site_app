import { getExhibitionsForCity } from "@/db/mongo";
import Image from "next/image";
import { Metadata } from 'next';
import AdsColumn from "@/components/AdsColumn";
import { getValidAds } from "@/lib/ads";
import { getOptimizedSrc } from "@/utils/getOptimizedSrc";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;


type Exhibition = {
    _id: string | { toString: () => string };
    date_end_st?: string;
    date_begin_st?: string;
    image_reference?: string[];
    city?: string;
    description?: string;
};

export async function generateMetadata({ params }: { params: { locale: string; city: string } }): Promise<Metadata> {
    const { locale, city: slug } = params;

    // Load locale-specific messages
    let messages;
    try {
        messages = (await import(`../../../../../locales/${locale}/exhibitions.json`)).default;
    } catch (error) {
        // Fallback to English if locale messages are not found
        messages = (await import(`../../../../../locales/en/exhibitions.json`)).default;
    }

    const serverSideExhibitions = await getExhibitionsForCity(slug);
    const exhibitions = serverSideExhibitions.exhibitions;
    const cityName = exhibitions[0]?.city;

    // Get the first exhibition with an image in this city
    const exhibitionWithImage = exhibitions.find((loc: any) => loc.image_reference);
    const image = exhibitionWithImage?.image_reference[0];
    // const imageName = image.split("?")[0].split("agenda/")[1];
    const optimizedUrl = getOptimizedSrc(image);
    let imageAlt = '';

    if (exhibitionWithImage) {
        imageAlt = `${exhibitionWithImage.title} at ${exhibitionWithImage.location} in ${cityName}`;
    }

    const baseUrl = 'https://www.artnowdatabase.eu';
    const canonicalUrl = `${baseUrl}/${locale}/exhibitions/cities/${slug}`;
    const title = `${messages.cities.meta_title_a} ${cityName} ${messages.cities.meta_title_b}`;
    const description = `${messages.cities.meta_description || 'Discover art exhibitions'} ${cityName}.`;

    const metadata: Metadata = {
        title: title,
        description: description,
        keywords: `${messages.cities.meta_keywords} ${cityName}`,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en': `https://www.artnowdatabase.eu/en/exhibitions/cities/${slug}`,
                'fr': `https://www.artnowdatabase.eu/fr/exhibitions/cities/${slug}`,
                'nl': `https://www.artnowdatabase.eu/nl/exhibitions/cities/${slug}`,
                'x-default': `https://www.artnowdatabase.eu/en/exhibitions/cities/${slug}`,
            },
        },
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            type: 'website',
            siteName: 'Art Now Database',
            ...(exhibitionWithImage && {
                images: [{
                    url: optimizedUrl,
                    width: 1200,
                    height: 630,
                    alt: imageAlt,
                }]
            })
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            ...(exhibitionWithImage && { images: [optimizedUrl] })
        },
        robots: {
            index: true,
            follow: true,
        },
        metadataBase: new URL(baseUrl),
    };

    // Add image alt text if available
    if (exhibitionWithImage) {
        metadata.other = {
            'image:alt': imageAlt,
        };
    }

    return metadata;
}

type Ad = {
    image_url: string;
    link: string;
    title: string;
};

export default async function CityPage({ params }: { params: { locale: string; city: string } }) {

    const { locale, city: slug } = params;
    const messages = await import(`../../../../../locales/${locale}/exhibitions.json`).then(m => m.default);
    const serverSideExhibitions = await getExhibitionsForCity(slug);
    const exhibitions = serverSideExhibitions.exhibitions;
    const city = exhibitions[0]?.city;
    const rawAds = await getValidAds();
    const ads: Ad[] = rawAds.map(ad => ({
        image_url: ad.image_url,
        link: ad.link,
        title: ad.title
    }));

    if (!exhibitions || exhibitions.length === 0) {

        <main className="flex flex-col items-center p-4 min-h-screen">
            <div className="mt-20">
                <h1 className="text-gray-500">{`We couldn't find any exhibitions in ${city}.`}</h1>
            </div>
            <div className="p-1 lg:w-1/5 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                <form action="/" method="GET">
                    <input type="hidden" name="city" value={city} />
                    <button type="submit" className="text-xl w-auto uppercase hover:text-gray-600">
                        Show on map
                    </button>
                </form>
                {/* <a href={`/?city=${city}`}>
                <p className="text-xl w-auto uppercase hover:text-gray-600">
                    See the Map
                </p>
            </a> */}
            </div>
        </main>
    }

    const validCities = ["N/A", "null", "", "-", "Unknown"];

    const validCity = exhibitions.find(exhibition =>
        exhibition.city && !validCities.includes(exhibition.city)
    )?.city;

    const formatDate = (dateStr: string) => {
        if (!dateStr || typeof dateStr !== "string" || !dateStr.includes('-')) {
            return "Invalid Date"; // or return an empty string, or handle as needed
        }
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };


    return (
        <div className="main-container flex flex-wrap min-h-screen overflow-auto mt-20">
            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40">
            </div>
            <div className="flex flex-col justify-center items-center w-full text-slate-800 px-1 mb-8 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5">

                {exhibitions.length > 0 ? (
                    <div>
                        <h1>
                            {/* <Modal url={data[0].url} location={data[0].location} /> */}
                            {/* Display city only if it's valid */}
                            {validCity && (
                                <span className="text-xl md:text-2xl text-gray-600 uppercase">
                                    {`${messages.cities.page_title} ${city}`}
                                </span>
                            )}
                        </h1>
                        <p className="max-w-3xl mt-4 text-gray-700 text-sm md:text-base">
                            {`${messages.cities.page_description.replace(/{{city}}/g, validCity || city)}`}
                        </p>
                    </div>
                ) : (<div>
                    <h1 className="text-2xl text-gray-700 font-semibold mb-4">
                        {`${messages.cities.noExhibitions}`} {city || slug.slice(0, 1).toLocaleUpperCase() + slug.slice(1)}
                    </h1>
                    <p className="max-w-2xl text-gray-600">
                        While we couldn&apos;t find any exhibitions happening in {slug.slice(0, 1).toUpperCase() + slug.slice(1).toLocaleLowerCase()} right now, the art scene is always evolving. Check back soon or explore exhibitions in nearby cities. You can also use our interactive map to discover art events across Europe.
                    </p>
                </div>

                )}

                <div className="w-auto p-2 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center mt-10">
                    <a
                        href={`/${locale}?city=${city}`}
                        className="text-sm"
                    >
                        {exhibitions.length > 0
                            ? messages.exploreMoreExhibitions.replace("{{city}}", validCity || city)
                            : messages.exploreExhibitions.replace("{{city}}", city || slug.slice(0, 1).toLocaleUpperCase() + slug.slice(1))}
                    </a>
                </div>

                <div className="mt-12">
                    <h3 className="uppercase text-2xl tracking-widest">{`${messages.cities.actual}`}</h3>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-12 mb-20 w-full gap-x-1 gap-y-6">
                    {[...exhibitions]
                        .sort((a, b) => {
                            const dateA = new Date(a.date_end_st ?? '');
                            const dateB = new Date(b.date_end_st ?? '');
                            const timeA = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
                            const timeB = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();
                            return timeA - timeB;
                        })
                        .map((exhibition: any, index: number) => {

                            const today = new Date();
                            const startDate = new Date(exhibition.date_begin_st);
                            const endDate = new Date(exhibition.date_end_st);
                            if (exhibition.image_reference && (today < endDate)) {

                                const optimizedUrl = getOptimizedSrc(exhibition.image_reference[0])

                                return (
                                    <li key={exhibition._id}
                                        className="relative group flex flex-col justify-between items-center text-center border p-4 rounded-lg shadow h-full w-full max-w-[260px] my-4"
                                    >

                                        {exhibition.description && (
                                            <div className="absolute z-10 inset-0 bg-white/90 backdrop-blur-sm text-gray-800 text-sm p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-y-auto overflow-x-hidden mb-12 pointer-events-auto">

                                                <div dangerouslySetInnerHTML={{ __html: exhibition.description }} />
                                            </div>
                                        )}

                                        {exhibition.description && (
                                            <div className="absolute top-0 left-0 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md shadow-md block xl:hidden pointer-events-none">
                                                {messages.description}
                                            </div>
                                        )}

                                        <div className="flex flex-col mt-2 space-y-2">
                                            <h2 className="text-sm italic">{exhibition.title}</h2>
                                            {startDate > today ? (
                                                <p className="mt-2 text-xs">
                                                    {formatDate(exhibition.date_begin_st)} – {formatDate(exhibition.date_end_st)}
                                                </p>
                                            ) : (
                                                <p className="mt-2 text-xs">
                                                    &#8702; {formatDate(exhibition.date_end_st)}
                                                </p>
                                            )}
                                        </div>
                                        {/* <h3 className="text-sm">{exhibition.city}</h3> */}
                                        {exhibition.image_reference && (
                                            <div className="flex flex-col space-y-4">
                                                {/* <a href={exhibition.url} target="_blank" rel="noopener noreferrer" className="relative group"> */}
                                                <Image
                                                    priority={index === 0}
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                    unoptimized
                                                    src={optimizedUrl}
                                                    alt={`${exhibition.title} at ${exhibition.location}, ${exhibition.city}`}
                                                    width={150}
                                                    height={50}
                                                    className="rounded-lg"
                                                />
                                                {/* <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition">
                                                Open external site
                                            </span> */}
                                                {/* </a> */}
                                            </div>
                                        )}
                                        {exhibition.artists && exhibition.artists !== "N/A" &&
                                            <p className='text-xs'>{exhibition.artists}</p>
                                        }
                                        {exhibition.location && exhibition.location !== "N/A" &&
                                            <p className='text-xs'>{exhibition.location}</p>
                                        }
                                        <div className="text-sm bg-slate-200 rounded-md z-20 p-1">
                                            <a
                                                href={exhibition.exhibition_url || exhibition.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {messages.moreInfo}
                                            </a>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                </ul>
                <div className="mt-12">
                    <h3 className="uppercase text-2xl tracking-widest">{`${messages.cities.past}`}</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-12 mb-20 w-full gap-x-1 gap-y-6">

                    {[...exhibitions]
                        .sort((a, b) => {
                            const dateA = new Date(a.date_end_st ?? '');
                            const dateB = new Date(b.date_end_st ?? '');
                            const timeA = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
                            const timeB = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();
                            return timeB - timeA;
                        })

                        .map((exhibition: any, index: number) => {

                            const today = new Date();
                            const startDate = new Date(exhibition.date_begin_st);
                            const endDate = new Date(exhibition.date_end_st);
                            if ((today > endDate)) {

                                return (
                                    <li key={exhibition._id}
                                        className="relative group flex flex-col justify-between items-center text-center border p-4 rounded-lg shadow h-full w-full max-w-[260px] my-4"
                                    >

                                        {exhibition.description && (
                                            <div className="absolute z-10 inset-0 bg-white/90 backdrop-blur-sm text-gray-800 text-sm p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-y-auto overflow-x-hidden mb-12 pointer-events-auto">

                                                <div dangerouslySetInnerHTML={{ __html: exhibition.description }} />
                                            </div>
                                        )}

                                        {exhibition.description && (
                                            <div className="absolute top-0 left-0 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md shadow-md block xl:hidden pointer-events-none">
                                                {messages.description}
                                            </div>
                                        )}

                                        <div className="flex flex-col mt-2 space-y-2">
                                            <h2 className="text-sm italic">{exhibition.title}</h2>
                                            {startDate > today ? (
                                                <p className="mt-2 text-xs">
                                                    {formatDate(exhibition.date_begin_st)} – {formatDate(exhibition.date_end_st)}
                                                </p>
                                            ) : (
                                                <p className="mt-2 text-xs">
                                                    &#8702; {formatDate(exhibition.date_end_st)}
                                                </p>
                                            )}
                                        </div>
                                        {/* <h3 className="text-sm">{exhibition.city}</h3> */}

                                        {exhibition.artists && exhibition.artists !== "N/A" &&
                                            <p className='text-xs'>{exhibition.artists}</p>
                                        }
                                        {exhibition.location && exhibition.location !== "N/A" &&
                                            <p className='text-xs'>{exhibition.location}</p>
                                        }
                                        <div className="text-sm bg-slate-200 rounded-md z-20 p-1">
                                            <a
                                                href={exhibition.exhibition_url || exhibition.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {messages.moreInfo}
                                            </a>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                </ul>
                {/* 

            <div className="md:w-2/3 lg:w-1/3 text-slate-200 min-h-screen flex flex-col justify-end">
                <div>
                    {data.length > 0 &&
                        <p className="mt-4">{exhibitions[0].description}
                        </p>}
                </div>
            </div> */}
            </div>
            {/* <div className="ads-container flex flex-col items-center w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">

                <AdsColumn
                    ads={ads}
                />
            </div> */}
        </div>
    );
}