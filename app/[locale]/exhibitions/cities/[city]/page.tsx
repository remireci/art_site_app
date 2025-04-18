import { getLocations_by_city, getExhibitionsByDomain } from "@/app/db/mongo";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: { locale: string; city: string } }): Promise<Metadata> {
    const { locale, city } = params;

    // Load locale-specific messages
    let messages;
    try {
        messages = (await import(`../../../../../locales/${locale}/exhibitions.json`)).default;
    } catch (error) {
        // Fallback to English if locale messages are not found
        messages = (await import(`../../../../../locales/en/exhibitions.json`)).default;
    }

    // Capitalize city name for display
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);

    return {
        title: `${cityName} ${messages['meta-title'] || 'Art Exhibitions'}`,
        description: `${messages['meta-description'] || 'Discover art exhibitions'} ${cityName}.`,
        keywords: `${cityName}, ${messages['meta-keywords'] || 'art exhibitions, contemporary art, modern art'}`,
    };
}

export default async function CityPage({ params }: { params: { city: string } }) {
    const { city } = params;

    const data = await getLocations_by_city(city);

    if (!data || data.length === 0) {
        return notFound();
    }

    // Now we need to get the domain from each location and use it to get exhibitions
    const exhibitionsWithDomains = await Promise.all(data.map(async (location) => {
        const { domain, city: locationCity, _id } = location;  // Destructure to get domain and city
        // Fetch exhibitions for the specific location (you can implement this function)
        const exhibitions = await getExhibitionsByDomain(domain);
        return {
            domain,
            exhibitions,
            city: locationCity,
            locationId: _id,
        };
    }));

    const exhibitions = exhibitionsWithDomains.flatMap(item =>
        item.exhibitions.map(exhibition => ({
            ...exhibition,
            city: item.city,
        }))
    );

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
        <main className="flex flex-col items-center p-4 min-h-screen">
            <div className="mt-20">
                {exhibitions.length > 0 ? (
                    <h1>
                        {/* <Modal url={data[0].url} location={data[0].location} /> */}
                        {/* Display city only if it's valid */}
                        {validCity && (
                            <span className="text-xl md:text-3xl text-gray-600 uppercase">
                                Exhibitions in{" - "}
                                {validCity.charAt(0).toUpperCase() + validCity.slice(1).toLowerCase()}
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
                {exhibitions.map((exhibition: any) => {
                    const imageName = exhibition.image_reference[0].split('?')[0].split('agenda/')[1];

                    const optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/width=300,fit=cover/agenda/${encodeURI(imageName as string)}`;

                    return (
                        <li key={exhibition._id}
                            className="flex flex-col justify-between items-center border p-4 rounded-lg shadow h-full w-full max-w-[250px] text-center">
                            <h2 className="text-sm italic">{exhibition.title}</h2>
                            {/* <h3 className="text-sm">{exhibition.city}</h3> */}
                            {exhibition.image_reference && (
                                <a href={exhibition.url} target="_blank" rel="noopener noreferrer" className="relative group">
                                    <Image
                                        unoptimized
                                        src={optimizedUrl}
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
                    )
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
        </main>
    );
}
