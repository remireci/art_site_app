import { getExhibitionsByCity } from "@/app/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function CityPage({ params }: { params: { city: string } }) {
    const { city } = params;

    const data = await getExhibitionsByCity(city);

    if (!data) {
        return notFound();
    }

    const formatDate = (dateStr: String) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };


    return (
        <main className="flex flex-col items-center p-4 min-h-screen">
            <div className="mt-20">

                {data.length > 0 && data[0]?.url && data[0]?.location ? (
                    <h1>
                        {/* <Modal url={data[0].url} location={data[0].location} /> */}
                        {/* Display city only if it's valid */}
                        {data[0].city && !["N/A", "null", "", "-", "Unknown"].includes(data[0].city) && (
                            <span className="text-xl md:text-3xl text-gray-600 uppercase">Exhibitions in
                                {" - "}{data[0].city.charAt(0).toUpperCase() + data[0].city.slice(1).toLowerCase()}
                            </span>
                        )}

                    </h1>
                ) : (
                    <p className="text-gray-500">No data available</p>
                )}

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

            <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2 space-y-1">
                {data.map((exhibition: any, index: number) => (
                    <li key={exhibition._id}
                        className="flex flex-col justify-between items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
                        <h2 className="text-sm italic">{exhibition.title}</h2>
                        {/* <h3 className="text-sm">{exhibition.city}</h3> */}
                        {exhibition.image_reference && (
                            <a href={exhibition.url} target="_blank" rel="noopener noreferrer" className="relative group">
                                <Image
                                    unoptimized
                                    src={exhibition.image_reference[0]}
                                    alt={exhibition.title}
                                    width={100}
                                    height={50}
                                    className="rounded-lg"
                                />
                                <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition">
                                    Open external site
                                </span>
                            </a>

                        )}
                        {exhibition.artists && exhibition.artists !== "N/A" &&
                            <p className='text-xs'>{exhibition.artists}</p>
                        }
                        {exhibition.location && exhibition.location !== "N/A" &&
                            <p className='text-xs'>{exhibition.location}</p>
                        }
                        <p className="text-xs mt-4">&#8702; {formatDate(exhibition.date_end_st)}</p>
                    </li>
                ))}
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
