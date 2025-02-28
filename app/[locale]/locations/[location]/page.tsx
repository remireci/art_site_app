import { getExhibitionsByDomain } from "@/app/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";
import Modal from "../../../components/LocationModal";

export default async function LocationPage({ params }: { params: { location: string } }) {
    const { location } = params;
    const data = await getExhibitionsByDomain(location);

    if (!data) {
        return notFound();
    }

    return (
        <main className="flex flex-col items-center p-4 min-h-screen">
            <div className="p-1 lg:w-1/5 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                <a href="/">
                    <h1 className="text-xl w-auto uppercase hover:text-gray-600">
                        Find exhibitions
                    </h1>
                </a>
            </div>

            {data.length > 0 && data[0]?.url && data[0]?.location ? (
                <Modal url={data[0].url} location={data[0].location} />
            ) : (
                <p className="text-gray-500">No data available</p>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2">
                {data.map((exhibition: any, index: number) => (
                    <li key={exhibition._id}
                        className="flex flex-col justify-between items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
                        <h2 className="text-sm">{exhibition.title}</h2>
                        <p className="text-xs">{exhibition.date_end_st}</p>

                        {exhibition.image_reference && (
                            <Image
                                unoptimized
                                src={exhibition.image_reference[0]}
                                alt={exhibition.title}
                                width={150}
                                height={100}
                                className="rounded-lg"
                            />
                        )}
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
