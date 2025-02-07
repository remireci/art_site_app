// components/Search.js
"use client"
import { useEffect, useState } from 'react';
import { formatDate } from '../utils/formatDate';
import ImageDisplay from './ImageDisplay';
import GetLocation from './GetLocation'

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('list');
    const [showClearButton, setShowClearButton] = useState(false);


    const initialSearchTerms = ["pain", "scul", "phot", "imag", "mode", "arch", "ber", "ams"];
    const number = initialSearchTerms.length;
    const indexInitialSearch = Math.floor(Math.random(number) * number);
    const initialSearchTerm = initialSearchTerms[indexInitialSearch];

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        setShowClearButton(inputValue.trim() !== '');
    };

    const handleClear = () => {
        setQuery('');
        setShowClearButton(false); // Hide clear button after clearing the field
    };

    useEffect(() => {
        const initialSearch = async () => {
            const response = await fetch(`/api/search?terms=${initialSearchTerm}`);
            const responseData = await response.json();

            // Assuming the backend response is an object with a 'data' property containing an array
            const data = responseData.data || [];

            // Assuming the backend response is an object with a 'urls' property            
            setResults(data);
            setLoading(false);
            setShowClearButton(true);
        }
        setLoading(true);
        initialSearch()
    }, [])

    const handleSearch = async () => {
        setInitialLoad(false)
        try {
            setLoading(true);
            console.log(query);
            const response = await fetch(`/api/search?terms=${query}`);
            const responseData = await response.json();

            // Assuming the backend response is an object with a 'data' property containing an array
            const data = responseData.data || [];

            // Assuming the backend response is an object with a 'urls' property            
            setResults(data);

            // Store articles in local storage to show them if needed dynamically

            const articles = data.filter(result => result.source === 'articles');

            localStorage.setItem('articles', JSON.stringify(articles));
            console.log("localStorage set");

        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Function to highlight the query text within the snippet and limit the length of the snippet
    const highlightQuery = (snippet, query) => {
        if (!query) return snippet; // Return the snippet as is if the query is empty

        const maxSnippetLength = 400; // Maximum length of the snippet
        const queryIndex = snippet.toLowerCase().indexOf(query.toLowerCase()); // Find the index of the query text in the snippet

        if (queryIndex === -1) return snippet; // Return the snippet as is if the query is not found

        // Calculate the start and end indices for the substring around the query text
        let startIndex = Math.max(0, queryIndex - 200);
        let endIndex = Math.min(snippet.length, queryIndex + query.length + 200);

        // Ensure that the snippet length does not exceed the maximum length
        if (endIndex - startIndex > maxSnippetLength) {
            // Adjust the start index to maintain the maximum length
            startIndex = Math.max(0, endIndex - maxSnippetLength);
        }

        // Extract the substring around the query text and highlight the query text
        const trimmedSnippet = snippet.substring(startIndex, endIndex);
        const regex = new RegExp(query, 'gi'); // Create a case-insensitive regular expression for the query
        const highlightedSnippet = trimmedSnippet.replace(regex, '<strong>$&</strong>'); // Wrap matched query text with <strong> tags

        return startIndex > 0 ? `...${highlightedSnippet}...` : highlightedSnippet;
    };
    return (
        <div className="main-container flex flex-wrap">
            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40"></div>
            <div className="flex flex-col justify-between w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 h-14 lg:h-40">
                <div className='input-container flex flex-row items-end justify-between w-full h-2/3'>
                    <div className='flex flex-row items-end relative w-full ml-2 text-slate-400'>
                        <textarea
                            className="w-full h-8 bg-slate-50 mr-2 p-1 placeholder:text-slate-300 placeholder:text-sm placeholder:font-light rounded border border-slate-300 focus:border-orange-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_1px_1px_#f97316]"
                            type="text"
                            placeholder='artist, city, museum, title...'
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch(); // Trigger search when Enter is pressed
                                }
                            }}
                        />
                        {showClearButton && <button className='clear-button absolute right-8 top-1' onClick={handleClear}>x</button>}
                    </div>
                    <button
                        className="w-1/5 h-8 bg-[#87bdd8] hover:bg-blue-800 text-sm text-slate-100 mx-1 rounded flex items-center justify-center"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

            </div>

            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className='h-1/3 bg-slate-500'></div>
            </div>

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block h-14 lg:h-40">

            </div>

            <div className="w-full px-1 my-1 mt-4 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className='flex justify-center space-x-10'>
                    <button className={`text-sm h-6 px-2 sm:mt-2  rounded ${activeTab === 'list' ? 'bg-slate-500 text-slate-100' : 'bg-gray-200 text-gray-800 border-2 border-blue-200'} hover:bg-blue-800`} onClick={() => handleTabChange('list')}>List</button>
                    <button className={`text-sm h-6 px-2 sm:mt-2 rounded ${activeTab === 'map' ? 'bg-slate-500 text-slate-100' : 'bg-gray-200 text-gray-800 border-2 border-blue-200'} hover:bg-blue-800`} onClick={() => handleTabChange('map')}>Map</button>
                </div>

                <div className='results-container overflow-y-auto sm:mt-4' style={{ maxHeight: '65vh' }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {/* Show text or agenda results based on activeTab */}
                            {/* {activeTab === 'articles' && results.filter(result => result.source === 'articles').length > 0 && (
                                <ul className='w-full bg-slate-200 z-5 p-4 rounded text-xs'>
                                    {results.filter(result => result.source === 'articles').map((result, index) => (
                                        <li key={index} className='mb-4'>
                                            <p className='mt-2 text-sm' dangerouslySetInnerHTML={{ __html: `${highlightQuery(result.snippet, query)}` }} />
                                            <a href={`/texts/${result._id}`} target="_blank" rel="noopener noreferrer">
                                                <p><span className='text-2xl ml-4 mr-2 mt-4'>&#8640;</span> {`/texts/${result._id}`}
                                                    Coming soon
                                                </p>
                                            </a>

                                        </li>
                                    ))}
                                </ul>
                            )} */}
                            {/* Show text or agenda results based on activeTab */}
                            {activeTab === 'map' && (
                                <ul className='flex flex-col items-center w-full bg-slate-50 z-5 p-4 rounded text-xs'>
                                    <div className='my-10 bg-[#87bdd8] hover:bg-blue-800 p-1 rounded text-slate-100'>
                                        <GetLocation />
                                    </div>

                                    {results.filter(result => result.source === 'agenda').map((result, index) => (
                                        <li key={index} className='mb-4'>
                                            <p className='mt-2 text-sm' dangerouslySetInnerHTML={{ __html: `${highlightQuery(result.snippet, query)}` }} />
                                            {/* <a href={`/texts/${result._id}`} target="_blank" rel="noopener noreferrer">
                                                <p><span className='text-2xl ml-4 mr-2 mt-4'>&#8640;</span> {`/texts/${result._id}`}
                                                    Coming soon
                                                </p>
                                            </a> */}
                                            <p>
                                                Coming soon
                                            </p>

                                        </li>
                                    ))}
                                </ul>
                            )}

                            {activeTab === 'list' && results.filter(result => result.source === 'agenda').length > 0 && (

                                <ul className='w-full bg-slate-50 z-5 p-4 rounded text-xs'>
                                    <div>
                                        {initialLoad && (
                                            <p className='text-center text-xs font-light italic text-slate-400 tracking-widest mb-4'>a glimpse into current exhibitions</p>
                                        )
                                        }

                                    </div>
                                    {results
                                        .filter(result => result.source === 'agenda' && result.date_end_st !== null)
                                        // .filter(result => {
                                        //     // Parse the end date into a Date object
                                        //     const endDate = new Date(result.date_end_st);
                                        //     const beginDate = new Date(result.date_begin_st)
                                        //     const today = new Date(); // Get the current date

                                        //     // Compare dates: Keep only results where the end date is in the future or today
                                        //     return beginDate <= today && endDate >= today;
                                        // })
                                        .map((result, index) => {
                                            // Helper function to ensure URL is correctly formatted
                                            const formatUrl = (url) => {
                                                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                                    return `https://www.${url}`;
                                                }
                                                return url;
                                            };

                                            // Format the URLs
                                            const exhibitionUrl = result.exh_url ? formatUrl(result.exh_url) : null;
                                            const locationUrl = formatUrl(result.url);


                                            // Ensure image_reference is valid and correctly formatted
                                            let imagePath = "";

                                            // Check if image_reference is an array and has elements
                                            if (Array.isArray(result.image_reference) && result.image_reference.length > 0) {
                                                // Define the priority order for image formats
                                                const priorityOrder = ['jpg', 'jpeg', 'png', 'svg'];

                                                // Filter and sort the image references by priority
                                                const sortedImages = result.image_reference.sort((a, b) => {
                                                    const getExtensionPriority = (url) => {
                                                        try {
                                                            const ext = url.split(/[?#]/)[0].split('.').pop().toLowerCase(); // Extract clean file extension
                                                            return priorityOrder.indexOf(ext) !== -1 ? priorityOrder.indexOf(ext) : Infinity;
                                                        } catch (err) {
                                                            console.error("Failed to extract extension for:", url, err);
                                                            return Infinity; // Push malformed URLs to the end
                                                        }
                                                    };

                                                    return getExtensionPriority(a) - getExtensionPriority(b);
                                                });

                                                console.log("Sorted images:", sortedImages); // Debug the sorted order

                                                // Select the first image in the sorted list
                                                imagePath = sortedImages[0];
                                            } else {
                                                // Fallback if image_reference is empty or not an array
                                                imagePath = result.image_reference || "";
                                            }

                                            // Remove trailing "?" if present
                                            if (String(imagePath).endsWith('?')) {
                                                imagePath = imagePath.slice(0, -1);
                                            }

                                            if (!String(imagePath).startsWith("http")) {
                                                imagePath = "";
                                            }

                                            const title = result.title || "";

                                            const isEven = index % 2 === 0;

                                            return (
                                                <li key={index} className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                                    {isEven ? (
                                                        // For even index: Text on the left, image on the right
                                                        <>
                                                            <div className="flex-1">
                                                                {exhibitionUrl ? (
                                                                    <a href={exhibitionUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm italic">
                                                                        {`${result.title}`}
                                                                        {result.artists && result.artists !== 'N/A' && <span>{` - ${result.artists}`}</span>}
                                                                    </a>
                                                                ) : (
                                                                    <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm italic">
                                                                        {`${result.title}`}
                                                                    </a>
                                                                )}
                                                                <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: `tot ${formatDate(result.date_end_st)}` }} />
                                                                <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm block sm:inline">
                                                                    {`in ${result.location}`}
                                                                </a>
                                                            </div>
                                                            <a href={exhibitionUrl || locationUrl} target="_blank" rel="noopener noreferrer">
                                                                <div className="relative mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 before:absolute before:top-[0px] before:left-0 before:-translate-x-52 before:w-48 before:h-[1px] before:bg-gray-400" style={{ width: '160px', height: '160px' }}>
                                                                    <ImageDisplay imagePath={imagePath} title={title} width="160" height="160" />
                                                                </div>
                                                            </a>
                                                        </>
                                                    ) : (
                                                        // For odd index: Image on the left, text on the right
                                                        <>
                                                            <a href={exhibitionUrl || locationUrl} target="_blank" rel="noopener noreferrer">
                                                                <div className="relative mt-2 sm:mt-0 sm:mr-4 flex-shrink-0 before:absolute before:top-[0px] before:right-0 before:translate-x-52 before:w-48 before:h-[1px] before:bg-gray-400" style={{ width: '160px', height: '160px' }}>
                                                                    <ImageDisplay imagePath={imagePath} title={title} width="160" height="160" />
                                                                </div>
                                                            </a>
                                                            <div className="flex-1 text-right">
                                                                {exhibitionUrl ? (
                                                                    <a href={exhibitionUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm italic">
                                                                        {`${result.title}`}
                                                                        {result.artists && result.artists !== 'N/A' && <span>{` - ${result.artists}`}</span>}
                                                                    </a>
                                                                ) : (
                                                                    <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm italic">
                                                                        {`${result.title}`}
                                                                    </a>
                                                                )}
                                                                <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: `tot ${formatDate(result.date_end_st)}` }} />
                                                                <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm block sm:inline">
                                                                    {`in ${result.location}`}
                                                                </a>
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            );
                                        })}
                                </ul>
                            )}
                            {/* Show message if no results */}
                            {results.length === 0 && !initialLoad && (
                                <p className='mx-4 mt-8'>No results found.</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5">
                {/* <div className='bg-amber-100 md-w-full h-40 w-4/5 border-t-4'></div>
                <div className='bg-green-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-indigo-500 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-pink-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-amber-100 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-green-300 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-indigo-500 w-full h-40 md-w-1/2 border-t-4'></div>
                <div className='bg-pink-300 w-full h-40 md-w-1/2 border-t-4'></div> */}
            </div>

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block">

            </div>

            <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 "></div>

            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 "></div>

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block"></div>

            <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 "></div>

            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 "></div>
            {/* <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:w-1/3 lg:px-1 lg:my-1 xl:w-1/3 "></div> */}
        </div>
    );
};

export default Search;
