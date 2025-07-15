import { getExhibitionsByDomain, getLocationBySlug } from "@/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";
import Modal from "../../../../components/LocationModal";
import { Metadata } from 'next';
import { convertToDomain } from "@/utils/convertToDomain";

// app/[locale]/exhibitions/locations/[location]/page.tsx

export async function generateMetadata({ params }: { params: { locale: string; location: string } }): Promise<Metadata> {
    const { locale, location } = params;

    // Load locale-specific messages
    let messages;
    try {
        messages = (await import(`../../../../../locales/${locale}/location.json`)).default;
    } catch (error) {
        // Fallback to English if locale messages are not found
        // @ts-ignore
        messages = (await import(`../../../../../locales/en/location.json`)).default;
    }

    const institution = await getLocationBySlug(location);
    const domain = institution?.domain;
    const city = institution?.city;

    const data = await getExhibitionsByDomain(domain);

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
    const imageName = image.split("?")[0].split("agenda/")[1];
    const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/format=auto,fit=cover,width=300/agenda/${encodeURI(imageName)}`;

    // Capitalize location name for display
    const locationName = location.charAt(0).toUpperCase() + location.slice(1);
    const title = `${data[0].location} ${messages['meta-title'] || 'Art Exhibitions'} in ${city}`;
    const description = `${messages['meta-description'] || 'Explore art exhibitions'} ${data[0].location}.`;

    return {
        title: title,
        description: description,
        keywords: `${locationName}, ${messages['meta-keywords'] || 'art exhibitions, contemporary art, modern art'}`,
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


export default async function LocationPage({ params }: { params: { location: string } }) {
    const { location } = params;
    const institution = await getLocationBySlug(location);
    const domain = institution?.domain;
    console.log("this is the domain", domain);
    // const data = await getExhibitionsByDomain(domain);
    const data = await getExhibitionsByDomain(domain, {
        includeHidden: false,
        includePast: false,
        includeFuture: true,
    });


    if (!data) {
        return notFound();
    }

    return (
        <main className="flex flex-col items-center p-4 min-h-screen">
            <div className="p-1 lg:w-1/5 h-8 my-20 bg-[#87bdd8] hover:bg-blue-300 text-sm text-slate-100 rounded flex items-center justify-center">
                <a
                    href="/"
                    className="w-full text-center"
                >
                    <p className="text-xl w-auto uppercase">
                        Search exhibitions
                    </p>
                </a>
            </div>

            {data.length > 0 && data[0]?.url && data[0]?.location ? (
                <a
                    className="text-md font-light underline rounded hover:bg-gray-100 p-1 border border-transparent hover:border-orange-400 transition-colors"
                    href={data[0].url}
                >

                    <h1 >
                        {data[0].location}
                        {data[0].city && (
                            <span className="text-sm text-gray-600"> - {" - "}{data[0].city.charAt(0).toUpperCase() + data[0].city.slice(1).toLowerCase()}</span>
                        )}
                    </h1>
                </a>
            ) : (
                <p className="text-gray-500">No data available</p>
            )}

            <div className="hidden md:w-2/3 lg:w-1/3 text-slate-200 flex flex-col justify-start">
                <div className="mt-20">
                    {data.length > 0 &&
                        <p className="mt-4">{institution?.description}
                        </p>}

                </div>
            </div>


            <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-20 gap-6 w-1/2">
                {data.map((exhibition: any, index: number) => {

                    // const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

                    // const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;

                    let optimizedUrl = '';

                    if (exhibition.image_reference[0]) {
                        const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

                        optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;

                    } else {

                        optimizedUrl = 'https://pub-1070865a23b94011a35efcf0cf91803e.r2.dev/byArtNowDatabase_placeholder.png';

                    }

                    return (
                        <li key={exhibition._id}
                            className="flex flex-col justify-between items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
                            <h2 className="text-sm">{exhibition.title}</h2>
                            <p className="text-xs">{exhibition.date_end_st}</p>

                            {exhibition.image_reference && (
                                <Image
                                    priority={index === 0}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    unoptimized
                                    src={optimizedUrl}
                                    alt={`${exhibition.title} at ${exhibition.location}, ${exhibition.city}`}
                                    width={150}
                                    height={100}
                                    className="rounded-lg"
                                />
                            )}
                        </li>
                    )
                })}
            </ul>


        </main>
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
