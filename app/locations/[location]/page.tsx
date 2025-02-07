import { getExhibitionsByDomain } from "@/app/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";
// import { getImageUrl } from "@/lib/supabase";

export default async function LocationPage({ params }: { params: { location: string } }) {

    const { location } = params;

    console.log("here is the location", location);


    const data = await getExhibitionsByDomain(location);

    console.log("and these are the location data", data);

    // // @TODO use process.env.NEXT_PUBLIC_API_BASE_URL
    // const response = await fetch(`http://localhost:3000/api/locations/${params.location}`);

    // console.log("this is the response", response);

    if (!data) {
        return notFound();
    }

    // const data = await response.json();
    // console.log("exhibitions array", data);
    // const exhibitions = Array.isArray(data.exhibitions) ? data.exhibitions : [];

    // return (
    //     <div>

    //         <p>het zal nog lukken</p>
    //         {/* <h1>{locationData.name}</h1>
    //         <p>Website: {locationData.domain}</p> */}
    //         {/* Render exhibitions, location details, etc. */}
    //     </div>
    // );

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold">{decodeURIComponent(params.location)}</h1>
            <ul className="mt-4 space-y-4">
                {data.map((exhibition: any) => (
                    <li key={exhibition.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{exhibition.title}</h2>
                        <p className="text-xl font-semibold">{exhibition.date_end_st}</p>
                        {/* <h2 className="text-xl font-semibold">{exhibition._id}</h2> */}
                        {exhibition.image_reference && (
                            <Image
                                unoptimized
                                src={exhibition.image_reference[0]}
                                alt={exhibition.title}
                                width={300}
                                height={200}
                                className="rounded-lg"
                            />
                        )}
                        <p>{exhibition.description}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
