import { getExhibitionsByDomain, getLocationBySlug } from "@/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import Modal from "../../../../components/LocationModal";
import { Metadata } from 'next';
import AdsColumn from "@/components/AdsColumn";
import { getValidAds } from "@/lib/ads";
import { convertToDomain } from "@/utils/convertToDomain";
import { getOptimizedSrc } from "@/utils/getOptimizedSrc";

// app/[locale]/exhibitions/locations/[location]/page.tsx

export async function generateMetadata({ params }: { params: { locale: string; location: string } }): Promise<Metadata> {
    const { locale, location } = params;

    // Load locale-specific messages
    let messages;
    try {
        messages = (await import(`../../../../../locales/${locale}/exhibitions.json`)).default;
    } catch (error) {
        // Fallback to English if locale messages are not found
        // @ts-ignore
        messages = (await import(`../../../../../locales/en/exhibitions.json`)).default;
    }

    const institution = await getLocationBySlug(location);
    const domain = institution?.domain;
    const city = institution?.city;

    const data = await getExhibitionsByDomain(domain, {
        includeHidden: false,
        includePast: false,
        includeFuture: true,
    });

    // 1. Handle empty data case first
    if (data.length === 0 || !data[0].image_reference) {
        return {
            title: "Location not found",
            description: "No exhibitions found for this location",
            alternates: {
                canonical: `/${locale}/exhibitions/locations/${location}`,
            },
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    const image = data[0].image_reference[0];
    const imageName = image?.split("?")[0].split("agenda/")[1];
    const optimizedUrl = getOptimizedSrc(image);

    // Capitalize location name for display
    const locationName = location.charAt(0).toUpperCase() + location.slice(1);
    const title = `${data[0].location} ${messages.locations.meta_title || 'Art Exhibitions'} in ${city}`;
    const description = `${messages.locations.meta_description || 'Explore art exhibitions'} ${data[0].location}.`;

    return {
        title: title,
        description: description,
        keywords: `${locationName}, ${messages.locations.meta_keywords || 'art exhibitions, contemporary art, modern art'}`,
        alternates: {
            canonical: `https://www.artnowdatabase.eu/${locale}/exhibitions/locations/${location}`,
            languages: {
                'en': `https://www.artnowdatabase.eu/en/exhibitions/locations/${location}`,
                'fr': `https://www.artnowdatabase.eu/fr/exhibitions/locations/${location}`,
                'nl': `https://www.artnowdatabase.eu/nl/exhibitions/locations/${location}`,
                'x-default': `https://www.artnowdatabase.eu/en/exhibitions/locations/${location}`,
            }
        },
        openGraph: {
            title: title,
            description: description,
            url: `/${locale}/exhibitions/locations/${location}`,
            type: 'website',
            images: [{
                url: optimizedUrl,
                width: 800,
                height: 600,
                alt: `${data[0].location} exhibition in ${city}`,
            }],
            siteName: 'Art Now Database',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [optimizedUrl],
        },
        // Additional metadata for images
        metadataBase: new URL('https://www.artnowdatabase.eu'),
        other: {
            'image:alt': `${data[0].location} exhibition in ${city} - Image courtesy of ${data[0].location}`,
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

type Ad = {
    image_url: string;
    link: string;
    title: string;
};


export default async function LocationPage({ params }: { params: { locale: string; location: string } }) {
    const { locale, location } = params;
    const messages = await import(`../../../../../locales/${locale}/exhibitions.json`).then(m => m.default);
    const institution = await getLocationBySlug(location);
    const domain = institution?.domain;
    const city = institution?.city;
    // console.log("this is the domain", domain);
    // const data = await getExhibitionsByDomain(domain);
    const data = await getExhibitionsByDomain(domain, {
        includeHidden: false,
        includePast: false,
        includeFuture: true,
    });
    // @TODO We could refactor the mongo function, to retrieve only axhibitions from the past
    // const archivedData = await getExhibitionsByDomain(domain, {
    //     includeHidden: false,
    //     includePast: true,
    //     includeRunning: false,
    //     includeFuture: false,
    // });
    // And then the user can click 'archived exhibitions' to make them appear on the page?
    const rawAds = await getValidAds();
    const ads: Ad[] = rawAds.map(ad => ({
        image_url: ad.image_url,
        link: ad.link,
        title: ad.title
    }));

    const validCities = ["N/A", "null", "", "-", "Unknown"];

    const validCity = data.find(exhibition =>
        exhibition.city && !validCities.includes(exhibition.city)
    )?.city;


    if (!data) {
        return notFound();
    }

    return (
        <div className="relative flex flex-col items-center p-4 min-h-screen">
            {data.length > 0 && data[0]?.url && data[0]?.location ? (
                <a
                    href={data[0].url}
                    className="w-full sm:w-auto px-1 py-1 mt-10 font-medium bg-slate-500 hover:bg-slate-400 text-sm text-slate-100 rounded flex items-center justify-center text-center cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h1>
                        {data[0].location}
                        {data[0].city && (
                            <span>
                                {" - "}
                                {data[0].city.charAt(0).toUpperCase() + data[0].city.slice(1).toLowerCase()}
                            </span>
                        )}
                    </h1>
                </a>

            ) : (
                <p className="text-gray-500">No data available</p>
            )}

            <div className="hidden md:w-2/3 lg:w-1/3 text-slate-200 flex-col justify-start">
                <div className="mt-20">
                    {data.length > 0 &&
                        <p className="mt-4">{institution?.description}
                        </p>}
                </div>
            </div>


            <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-20 gap-6 w-full lg:w-1/2">
                {data.map((exhibition: any, index: number) => {

                    // const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

                    // const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;


                    const today = new Date();
                    const startDate = new Date(exhibition.date_begin_st);

                    const optimizedUrl = getOptimizedSrc(exhibition.image_reference[0]);

                    return (
                        <li
                            key={exhibition._id}
                            className="relative group flex flex-col justify-between items-center text-center border p-4 rounded-lg shadow w-full max-w-[250px] space-y-3"
                        >
                            {/* Hover Popup */}
                            {exhibition.description && (
                                <div className="absolute z-10 inset-0 bg-white/90 backdrop-blur-sm text-gray-800 text-sm p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-auto max-h-[320px] pointer-events-auto">

                                    <div dangerouslySetInnerHTML={{ __html: exhibition.description }} />
                                </div>
                            )}
                            {exhibition.description && (
                                <div className="absolute -top-3 left-0 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md shadow-md block lg:hidden pointer-events-none">
                                    {messages.description}
                                </div>
                            )}
                            {/* Card Content */}
                            <div className="flex flex-col space-y-2">
                                <h2 className="text-sm">{exhibition.title}</h2>


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
                            {exhibition.image_reference && (
                                <div className="flex flex-col space-y-4">
                                    <Image
                                        priority={index === 0}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        unoptimized
                                        src={optimizedUrl}
                                        alt={`${exhibition.title} at ${exhibition.location}, ${exhibition.city}`}
                                        width={150}
                                        height={50}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
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
                })}
            </ul>
            <div className="px-5 w-auto h-8 mt-40 mb-20 bg-[#87bdd8] hover:bg-blue-300 text-sm text-slate-100 rounded flex items-center justify-center">
                <a
                    href={`/${locale}?city=${city}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {data.length > 0
                        ? messages.exploreMoreExhibitions.replace("{{city}}", validCity || city)
                        : messages.exploreExhibitions.replace("{{city}}", validCity || city)}
                </a>
            </div>
            {/* <div className="ads-container flex flex-col items-center w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">
                <AdsColumn
                    ads={ads}
                />
            </div> */}
        </div>
    );
}


// import { getExhibitionsByDomain } from "@/app/db/mongo";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// // import { getImageUrl } from "@/lib/supabase";

// export default async function LocationPage({ params }: { params: { location: string } }) {

//     const { location } = params;

//     console.log("here is the location", location);


//     const data = await getExhibitionsByDomain(location);

//     console.log("and these are the location data", data);

//     // // @TODO use process.env.NEXT_PUBLIC_API_BASE_URL
//     // const response = await fetch(`http://localhost:3000/api/locations/${params.location}`);

//     // console.log("this is the response", response);

//     if (!data) {
//         return notFound();
//     }

//     // const data = await response.json();
//     // console.log("exhibitions array", data);
//     // const exhibitions = Array.isArray(data.exhibitions) ? data.exhibitions : [];

//     // return (
//     //     <div>

//     //         <p>het zal nog lukken</p>
//     //         {/* <h1>{locationData.name}</h1>
//     //         <p>Website: {locationData.domain}</p> */}
//     //         {/* Render exhibitions, location details, etc. */}
//     //     </div>
//     // );

//     return (
//         <main className="flex flex-col justify-between items-center p-4 min-h-screen">

//             {/* <button
//                 className="w-1/5 h-8 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 mx-1 rounded flex items-center justify-center"
//                 onClick={handleSearch}
//             >
//                 Search
//             </button> */}
//             <div className="w-1/5 h-8 my-40 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
//                 <a href="/">
//                     <h1 className="font-semibold text-xl tracking-widest uppercase hover:text-gray-600">
//                         Back to the Calendar
//                     </h1>
//                 </a>
//             </div>
//             <a href={data[0].url} target="_blank" rel="noopener">
//                 <h2 className="text-2xl">{data[0].location}</h2>
//             </a>


//             <ul className="mt-4 space-y-4">
//                 {data.map((exhibition: any) => (
//                     <li key={exhibition.id} className="border p-4 rounded-lg shadow">
//                         <h2 className="text-xl font-semibold">{exhibition.title}</h2>
//                         <p className="text-xl font-semibold">{exhibition.date_end_st}</p>
//                         {exhibition.image_reference && (
//                             <Image
//                                 unoptimized
//                                 src={exhibition.image_reference[0]}
//                                 alt={exhibition.title}
//                                 width={300}
//                                 height={200}
//                                 className="rounded-lg"
//                             />
//                         )}
//                     </li>
//                 ))}
//             </ul>
//             <div className="w-1/3">
//                 {data.length > 0 && <p className="mt-4">{data[0].description}</p>}
//             </div>
//         </main>
//     );

// }
