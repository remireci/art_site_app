import { getLocations_by_city, getExhibitionsByDomain } from "@/app/db/mongo";
import Image from "next/image";
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: { locale: string; city: string } }): Promise<Metadata> {
    const { locale, city: slug } = params;

    const data = await getLocations_by_city(slug);

    const cityName = data[0]?.city;

    // Load locale-specific messages
    let messages;
    try {
        messages = (await import(`../../../../../locales/${locale}/exhibitions.json`)).default;
    } catch (error) {
        // Fallback to English if locale messages are not found
        messages = (await import(`../../../../../locales/en/exhibitions.json`)).default;
    }

    const baseUrl = 'https://www.artnowdatabase.eu';


    return {
        title: `${messages['meta-title_a']} ${cityName} ${messages['meta-title_b']}`,
        description: `${messages['meta-description'] || 'Discover art exhibitions'} ${cityName}.`,
        keywords: `${messages['meta-keywords']} ${cityName}`,
        alternates: {
            canonical: `${baseUrl}/${locale}/exhibitions/cities/${slug}`,
        },
    };
}

export default async function CityPage({ params }: { params: { locale: string; city: string } }) {

    const { locale, city: slug } = params;
    const messages = await import(`../../../../../locales/${locale}/exhibitions.json`).then(m => m.default);
    const data = await getLocations_by_city(slug);
    const city = data[0]?.city;

    if (!data || data.length === 0) {

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
                    <div>
                        <h1>
                            {/* <Modal url={data[0].url} location={data[0].location} /> */}
                            {/* Display city only if it's valid */}
                            {validCity && (
                                <span className="text-xl md:text-3xl text-gray-600 uppercase">
                                    {`${messages.page_title} ${city}`}
                                </span>
                            )}
                        </h1>
                        <p className="max-w-3xl mt-4 text-gray-700 text-sm md:text-base">
                            {`${messages.page_description.replace(/{{city}}/g, validCity || city)}`}
                        </p>
                    </div>
                ) : (<div>
                    <h1 className="text-2xl text-gray-700 font-semibold mb-4">
                        {`${messages.noExhibitions}`} {city || slug.slice(0, 1).toLocaleUpperCase() + slug.slice(1)}
                    </h1>
                    <p className="max-w-2xl text-gray-600">
                        While we couldn&apos;t find any exhibitions happening in {slug.slice(0, 1).toUpperCase() + slug.slice(1).toLocaleLowerCase()} right now, the art scene is always evolving. Check back soon or explore exhibitions in nearby cities. You can also use our interactive map to discover art events across Europe.
                    </p>
                </div>

                )}
            </div>
            <div className="p-1 lg:w-1/5 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
                <a
                    href={`/${locale}?city=${city}`}
                    className="text-sm"
                >
                    {exhibitions.length > 0
                        ? messages.exploreMoreExhibitions.replace("{{city}}", validCity || city)
                        : messages.exploreExhibitions.replace("{{city}}", city || slug.slice(0, 1).toLocaleUpperCase() + slug.slice(1))}
                </a>

                {/* <form action="/" method="GET">
                    <input type="hidden" name="city" value={city} />
                    <button type="submit" className="text-xl w-auto uppercase hover:text-gray-600">
                        Show on map
                    </button>
                </form> */}
                {/* <a href={`/?city=${city}`}>
                    <p className="text-xl w-auto uppercase hover:text-gray-600">
                        See the Map
                    </p>
                </a> */}
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2 space-y-1">
                {exhibitions.map((exhibition: any, index: number) => {

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
                            <h2 className="text-sm italic">{exhibition.title}</h2>
                            {/* <h3 className="text-sm">{exhibition.city}</h3> */}
                            {exhibition.image_reference && (
                                <a href={exhibition.url} target="_blank" rel="noopener noreferrer" className="relative group">
                                    <Image
                                        priority={index === 0}
                                        loading={index === 0 ? "eager" : "lazy"}
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
