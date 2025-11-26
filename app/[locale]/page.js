import Search from "../components/Search";
import { extractDomain } from "../utils/extractDomain";
import { shuffleArray } from "../utils/shuffleArray";
import { getTranslations } from "next-intl/server";
import { getValidAds } from '@/lib/ads';
// export const runtime = 'edge';


function getRandomSubset(arr, count) {
  const shuffled = [...arr]; // avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// This helper function - normalizeExhibition - is only introduced to keep the original logic 
// in the API; where search i also handling text documents;
// mayby ultimately we should separate this logic in two API's
// on client we have to be in accordance with this logic:
// {activeTab === 'list' && results && results.filter(result => result.source === 'agenda').length > 0 && (

function normalizeExhibition(exh) {
  return {
    ...exh,
    source: exh.source ?? 'agenda',
    snippet: exh.snippet ?? '',
  };
}


export default async function HomePage({ params }) {

  const { locale } = params;
  const t = await getTranslations('homepage');
  // const t = await getTranslations();

  const URL =
    process.env.NODE_ENV === "production"
      ? "https://www.artnowdatabase.eu"
      : "http://localhost:3000";

  const initialSearchTerms = ["pain", "scul", "phot", "imag", "mode", "arch", "ber", "ams", 'kunsthal', 'dessin'];
  const number = initialSearchTerms.length;
  const indexInitialSearch = Math.floor(Math.random(number) * number);
  const initialSearchTerm = initialSearchTerms[indexInitialSearch];

  try {
    const cacheOption =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 3600 } };

    const locationsResponse = await fetch(`${URL}/api/map/locations`, cacheOption);
    const exhibitionsResponse = await fetch(`${URL}/api/exhibitions`, cacheOption);

    const ads = await getValidAds();


    // console.log("the valid ads", ads);

    // const response = await fetch(`${URL}/api/search?terms=${initialSearchTerm}`, { cache: "no-store" });
    // const responseData = await response.json();
    // const data = responseData.data || [];
    // const randomized = shuffleArray(data);

    // console.log("the randomized", randomized);


    if (!locationsResponse.ok || !exhibitionsResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const locations = await locationsResponse.json();
    const exhibitions = await exhibitionsResponse.json();

    // console.log("Sample locations data:", locations.slice(0, 10));
    console.log("Total number of displayed exhibitions:", exhibitions.length);
    console.log("Total number of displayed locations:", locations.length);

    // const civa = exhibitions.filter(exh => exh.domain === "civa.brussels");
    // console.log(civa);

    const randomExhibitions = getRandomSubset(exhibitions, 20).map(normalizeExhibition);

    const extractWords = (title) =>
      title
        .toLowerCase()
        .split(/\s+/) // Split by whitespace
        .filter((word) => word.length >= 4); // Keep words with at least 4 characters


    const filteredLocations = locations.filter((location) =>
      exhibitions.some((exhibition) => extractDomain(exhibition.url) === location.domain)
    );

    const locationsMap = filteredLocations.reduce((map, location) => {
      // Store array of locations per domain for multi-location case
      if (!map[location.domain]) map[location.domain] = [];
      map[location.domain].push(location);
      return map;
    }, {});

    const groupedExhibitions = {};

    for (const exhibition of exhibitions) {
      const domain = extractDomain(exhibition.url);
      if (!domain) continue;

      // Get all locations for this domain
      const domainLocations = locationsMap[domain] || [];

      // Check if any location is marked as multi-location
      const hasMultiLocations = domainLocations.some(loc => loc.hasMultipleLocations);

      // Create the group key
      const groupKey = hasMultiLocations
        ? `${domain}_${exhibition.location}`
        : domain;

      // Initialize the group if it doesn't exist
      if (!groupedExhibitions[groupKey]) {
        groupedExhibitions[groupKey] = {
          key: groupKey,
          domain,
          location: exhibition.location,
          exhibitions: []  // This will directly contain the array
        };
      }
      // Push the exhibition directly into the array
      groupedExhibitions[groupKey].exhibitions.push(exhibition);
    }

    const uniqueGroups = Object.values(groupedExhibitions).map(group => {
      const titleMap = {};
      return {
        ...group,
        exhibitions: group.exhibitions.filter(exhibition => {
          const normalizedTitle = exhibition.title.toLowerCase().trim();
          if (!titleMap[normalizedTitle]) {
            titleMap[normalizedTitle] = true;
            return true;
          }
          return false;
        })
      };
    });


    // Now you can get your unique exhibitions if needed
    const uniqueExhibitions = uniqueGroups.flatMap(group => group.exhibitions);

    // Filter for SMB museum
    // const smbGroups = uniqueGroups.filter(group => group.domain === 'smb.museum');


    // console.log("cached or not?", smbGroups);

    return (
      <div>
        <div className="flex-1 relative hidden lg:block flex-col justify-center items-right">
          <section className="absolute top-10 lg:right-0 xl:left-0 w-1/4 xl:w-1/5 text-xs text-slate-600 font-light lg:pl-10 lg:pr-0 lg:py-20 xl:pl-4 xl:pr-24 xl:py-10">
            <h1>{t('introduction')}</h1>
            <p>
              {t('description1')}
            </p>
            <p>
              {t('description2')}
            </p>
          </section>
        </div>
        <div className="relative z-10">
          <Search
            initialList={randomExhibitions}
            initialLocations={filteredLocations}
            exhibitions={uniqueGroups}
            locale={locale}
            ads={ads}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
