// "use client";
// import { useEffect, useState } from "react";
// import { notFound } from "next/navigation";
// import { Exhibition } from "@/types";
// import ExhibitionCard from "./ExhibitionCard";
// import AddExhibitionButton from "./AddExhibitionButton";

// interface Props {
//     exhibitionsData: Exhibition[];
//     locationData: any
// }

// export default function ExhibitionsTab({ exhibitionsData, locationData }: Props) {
//     // const { location } = params;
//     const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

//     useEffect(() => {
//         if (exhibitionsData && exhibitionsData.length > 0) {
//             setExhibitions(exhibitionsData);
//         }
//     }, [exhibitionsData, exhibitionsData[0].image_reference[0]]);

//     if (!exhibitionsData) {
//         return notFound();
//     }

//     const handleUpdate = (updatedExhibition: Exhibition) => {
//         setExhibitions(prev =>
//             prev.map(ex =>
//                 ex._id === updatedExhibition._id ? updatedExhibition : ex
//             )
//         );
//     };

//     return (
//         <div className="p-6 lg:max-w-3xl mx-auto text-slate-600">
//             <div className="flex flex-col items-center justify-center mt-8">
//                 {exhibitionsData.length > 0 && exhibitionsData[0]?.url && exhibitionsData[0]?.location ? (
//                     <p className="text-md hover:text-blue-800">
//                         <a href={exhibitionsData[0].url} target="_blank" rel="noopener noreferrer">
//                             {exhibitionsData[0].location}
//                             {exhibitionsData[0].city && !["N/A", "null", "", "-", "Unknown"].includes(exhibitionsData[0].city) && (
//                                 <span className="text-sm">
//                                     {" - "}{exhibitionsData[0].city.charAt(0).toUpperCase() + exhibitionsData[0].city.slice(1).toLowerCase()}
//                                 </span>
//                             )}
//                         </a>
//                     </p>
//                 ) : (
//                     <p className="text-gray-500">No data available</p>
//                 )}

//                 <div className="flex flex-col w-full mt-20 items-center">
//                     <AddExhibitionButton
//                         location={locationData.location}
//                         domain={locationData.domain}
//                         url={locationData.url}
//                     />
//                 </div>

//                 <div className="w-auto px-4 mt-20 mb-4 bg-slate-200 text-sm text-slate-100 rounded flex items-center justify-center">
//                     <p className="text-md uppercase text-gray-600">
//                         Your actual exhibitions
//                     </p>
//                 </div>

//                 <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2">
//                     {exhibitions.map((exhibition, index) => (
//                         <ExhibitionCard
//                             key={exhibition._id}
//                             exhibition={exhibition}
//                             onUpdate={handleUpdate}
//                             priority={index === 0}
//                         />
//                     ))}
//                 </ul>
//                 <div className="md:w-2/3 lg:w-1/3 text-slate-200 min-h-screen flex flex-col justify-end">
//                 </div>
//             </div>
//         </div >
//     );
// }


"use client";
import { useEffect, useState, useCallback } from "react";
import { notFound } from "next/navigation";
import { Exhibition } from "@/types";
import ExhibitionCard from "./ExhibitionCard";
import AddExhibitionButton from "./AddExhibitionButton";

interface Props {
    exhibitionsData: Exhibition[];
    locationData: any
}

export default function ExhibitionsTab({ exhibitionsData, locationData }: Props) {
    // const { location } = params;
    const [actualExhibitions, setActualExhibitions] = useState<Exhibition[]>([]);
    const [futureExhibitions, setFutureExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(false);


    // Helper: split exhibitions into actual and future based on date
    const splitExhibitions = useCallback((exhibitions: Exhibition[]) => {
        const today = new Date().toISOString().slice(0, 10);

        const actual = exhibitions.filter(
            (ex) => !ex.date_begin_st || ex.date_begin_st <= today
        );

        console.log("the actual exhibitions", actual);

        const future = exhibitions.filter(
            (ex) => ex.date_begin_st && ex.date_begin_st > today
        );

        console.log("the future exhibitions", future);

        setActualExhibitions(actual);
        setFutureExhibitions(future);
    }, []);

    const fetchExhibitions = useCallback(async () => {
        const domain = exhibitionsData[0].domain;

        setLoading(true);
        try {
            const res = await fetch(`/api/exhibitions?domain=${domain}`);
            if (!res.ok) {
                throw new Error("Failed to fetch exhibitions");
            }
            const data: Exhibition[] = await res.json();
            splitExhibitions(data);
        } catch (error) {
            console.error("Error fetching exhibitions:", error);
        } finally {
            setLoading(false);
        }
    }, [splitExhibitions]);

    // On mount, initialize state with props or fetch fresh
    useEffect(() => {
        if (exhibitionsData && exhibitionsData.length > 0) {
            console.log("the exhibitionsData", exhibitionsData);
            // splitExhibitions(exhibitionsData);
            fetchExhibitions();
        } else {
            fetchExhibitions();
        }
    }, [exhibitionsData, splitExhibitions, fetchExhibitions]);

    // Called when an exhibition is updated - refetch all exhibitions again
    const handleUpdate = async (updatedExhibition: Exhibition) => {
        // Optionally, you can do local state update here for immediate UI feedback
        // But to keep data consistent, refetch full list after update/mutation

        console.log("This is the id", updatedExhibition._id);

        const today = new Date().toISOString().slice(0, 10);
        const isFuture = updatedExhibition.date_begin_st && updatedExhibition.date_begin_st > today;

        setActualExhibitions(prev => {
            const withoutCurrent = prev.filter(ex => ex._id !== updatedExhibition._id);
            return isFuture ? withoutCurrent : [...withoutCurrent, updatedExhibition];
        });

        setFutureExhibitions(prev => {
            const withoutCurrent = prev.filter(ex => ex._id !== updatedExhibition._id);
            return isFuture ? [...withoutCurrent, updatedExhibition] : withoutCurrent;
        });

        // Optional: only refetch if necessary — can be removed if onSave handles local state well
        await fetchExhibitions();
    };

    if (!exhibitionsData) {
        return notFound();
    }


    return (
        <div className="p-6 lg:max-w-3xl mx-auto text-slate-600">
            <div className="flex flex-col items-center justify-center mt-8">
                {exhibitionsData.length > 0 && exhibitionsData[0]?.url && exhibitionsData[0]?.location ? (
                    <p className="text-md hover:text-blue-800">
                        <a href={exhibitionsData[0].url} target="_blank" rel="noopener noreferrer">
                            {exhibitionsData[0].location}
                            {exhibitionsData[0].city && !["N/A", "null", "", "-", "Unknown"].includes(exhibitionsData[0].city) && (
                                <span className="text-sm">
                                    {" - "}{exhibitionsData[0].city.charAt(0).toUpperCase() + exhibitionsData[0].city.slice(1).toLowerCase()}
                                </span>
                            )}
                        </a>
                    </p>
                ) : (
                    <p className="text-gray-500">No data available</p>
                )}

                <div className="flex flex-col w-full mt-20 items-center">
                    <AddExhibitionButton
                        location={locationData.location}
                        domain={locationData.domain}
                        onUpdate={handleUpdate}
                        url={locationData.url}
                    />
                </div>

                <div className="w-auto px-4 mt-20 mb-4 bg-slate-200 text-sm text-slate-100 rounded flex items-center justify-center">
                    <p className="text-md uppercase text-gray-600">
                        Your actual exhibitions
                    </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2">
                    {actualExhibitions.map((exhibition, index) => (
                        <ExhibitionCard
                            key={exhibition._id ?? `fallback-key-${index}`}
                            exhibition={exhibition}
                            onUpdate={handleUpdate}
                            priority={index === 0}
                        />
                    ))}
                </ul>
                <div className="w-auto px-4 mt-20 mb-4 bg-slate-200 text-sm text-slate-100 rounded flex items-center justify-center">
                    <p className="text-md uppercase text-gray-600">
                        Your future exhibitions
                    </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2">
                    {futureExhibitions.map((exhibition, index) => (
                        <ExhibitionCard
                            key={exhibition._id}
                            exhibition={exhibition}
                            onUpdate={handleUpdate}
                            priority={index === 0}
                        />
                    ))}
                </ul>

                <div className="md:w-2/3 lg:w-1/3 text-slate-200 min-h-screen flex flex-col justify-end">
                </div>
            </div>
        </div >
    );
}