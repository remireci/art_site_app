import { getExhibitionsByDomain } from "@/app/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";
import Modal from "../../../../components/LocationModal";
import { Metadata } from 'next';

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


    const originalDomain = params.location.replace(/-/g, ".");

    const data = await getExhibitionsByDomain(originalDomain);

    // 3. Handle empty data case
    if (data.length === 0) {
        return {
            title: "Location not found",
            description: "No exhibitions found for this location",
            alternates: {
                canonical: `/${locale}/exhibitions/locations/${location}`,
            },
            robots: {
                index: false, // Prevent indexing of empty pages
                follow: true,
            },
        };
    }


    // Capitalize location name for display
    const locationName = location.charAt(0).toUpperCase() + location.slice(1);

    return {
        title: `${data[0].location} ${messages['meta-title'] || 'Art Exhibitions'}`,
        description: `${messages['meta-description'] || 'Explore art exhibitions'} at ${data[0].location}.`,
        keywords: `${locationName}, ${messages['meta-keywords'] || 'art exhibitions, contemporary art, modern art'}`
    };
}


export default async function LocationPage({ params }: { params: { location: string } }) {
    // const { location } = params;
    const originalDomain = params.location.replace(/-/g, ".");
    console.log("location", originalDomain);
    const data = await getExhibitionsByDomain(originalDomain);

    if (!data) {
        return notFound();
    }


    return (
        <main className="flex flex-col items-center p-4 min-h-screen">
            <div className="p-1 lg:w-1/5 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                <a href="/">
                    <p className="text-xl w-auto uppercase hover:text-gray-600">
                        Search exhibitions
                    </p>
                </a>
            </div>

            {data.length > 0 && data[0]?.url && data[0]?.location ? (
                <h1>
                    <Modal url={data[0].url} location={data[0].location} />
                    {/* Display city only if it's valid */}
                    {data[0].city && !["N/A", "null", "", "-", "Unknown"].includes(data[0].city) && (
                        <span className="text-sm text-gray-600 lowercase">
                            {" - "}{data[0].city.charAt(0).toUpperCase() + data[0].city.slice(1).toLowerCase()}
                        </span>
                    )}
                </h1>
            ) : (
                <p className="text-gray-500">No data available</p>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2">
                {data.map((exhibition: any, index: number) => {

                    const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

                    const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;

                    return (
                        <li key={exhibition._id}
                            className="flex flex-col justify-between items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
                            <h2 className="text-sm">{exhibition.title}</h2>
                            <p className="text-xs">{exhibition.date_end_st}</p>

                            {exhibition.image_reference && (
                                <Image
                                    unoptimized
                                    src={optimizedUrl}
                                    alt={exhibition.title}
                                    width={150}
                                    height={100}
                                    className="rounded-lg"
                                />
                            )}
                        </li>
                    )
                })}
            </ul>


            <div className="md:w-2/3 lg:w-1/3 text-slate-200 min-h-screen flex flex-col justify-end">
                <div>
                    {data.length > 0 &&
                        <p className="mt-4">{data[0].description}
                        </p>}

                </div>
            </div>
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
