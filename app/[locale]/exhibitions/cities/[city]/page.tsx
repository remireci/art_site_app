import { getLocations_by_city, getExhibitionsByDomain } from "@/db/mongo";
import Image from "next/image";
import { Metadata } from 'next';
import AdsColumn from "@/components/AdsColumn";
import { getValidAds } from "@/lib/ads";


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

    const data = await getLocations_by_city(slug);
    const cityName = data[0]?.city;

    // Get the first exhibition with an image in this city
    const exhibitionWithImage = data.find((loc: any) => loc.image_reference);
    let optimizedUrl = '';
    let imageAlt = '';

    if (exhibitionWithImage) {
        const image = exhibitionWithImage.image_reference;
        const imageName = image.split("?")[0].split("agenda/")[1];
        optimizedUrl = `https://img.artnowdatabase.eu/cdn-cgi/image/format=auto,fit=cover,width=1200/agenda/${encodeURI(imageName)}`;
        imageAlt = `${exhibitionWithImage.title} at ${exhibitionWithImage.location} in ${cityName}`;
    }

    console.log("the optimized url from cities page", optimizedUrl);

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
    const data = await getLocations_by_city(slug);
    const city = data[0]?.city;
    const rawAds = await getValidAds();

    const ads: Ad[] = rawAds.map(ad => ({
        image_url: ad.image_url,
        link: ad.link,
        title: ad.title
    }));

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
        const { domain, city: locationCity, _id } = location;
        const isValidDomain = domain && typeof domain === "string" && domain.includes(".") && !domain.startsWith("http");
        if (!isValidDomain) {
            console.warn(`⚠️ Skipping invalid domain: '${domain}' for city: ${locationCity}`);
            return {
                domain,
                exhibitions: [],
                city: locationCity,
                locationId: _id,
            };
        }

        // Fetch exhibitions for the specific location (you can implement this function)
        const exhibitions = await getExhibitionsByDomain(domain);
        return {
            domain,
            exhibitions,
            city: locationCity,
            locationId: _id,
        };
    }));

    // exhibitionsWithDomains.forEach((item, index) => {
    //     console.log(`Item ${index + 1}: domain=${item.domain}, city=${item.city}, exhibitions=${item.exhibitions.length}`);
    // });



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
        <div className="main-container flex flex-wrap min-h-screen overflow-auto">
            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40">
            </div>
            <div className="flex flex-col justify-center items-center w-full text-slate-800 px-1 mb-8 mt-2 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className="mt-20">
                    {exhibitions.length > 0 ? (
                        <div>
                            <h1>
                                {/* <Modal url={data[0].url} location={data[0].location} /> */}
                                {/* Display city only if it's valid */}
                                {validCity && (
                                    <span className="text-xl md:text-3xl text-gray-600 uppercase">
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
                </div>
                <div className="p-1 h-8 my-20 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 rounded flex items-center justify-center">
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
                <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center mt-4 gap-4 w-1/2 space-y-1 my-20">
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
                                            alt={`${exhibition.title} at ${exhibition.location}, ${exhibition.city}`}
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
            </div>
            <div className="ads-container flex flex-col items-center w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">

                <AdsColumn
                    ads={ads}
                />
            </div>
        </div>
    );
}