// components/Search.js
"use client"
import { useState } from 'react';
import { formatDate } from '../utils/formatDate';
import ImageDisplay from './ImageDisplay';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('articles');
    const [showClearButton, setShowClearButton] = useState(false);


    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        setShowClearButton(inputValue.trim() !== '');
    };

    const handleClear = () => {
        setQuery('');
        setShowClearButton(false); // Hide clear button after clearing the field
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
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

        <div className="main-container flex flex-wrap overflow-hidden">

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block"></div>

            <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <h1>Welcome to the Informational Site</h1>
                <div className='input-container flex flex-row items-end justify-between w-full h-2/3 '>
                    <div className='flex flex-row items-end relative w-full mx-4'>
                        <textarea className='w-full h-10 bg-slate-200 mr-4 p-2 rounded' type="text" value={query} onChange={handleInputChange} />
                        {showClearButton && <button className='clear-button absolute right-8 top-2' onClick={handleClear}>x</button>}
                    </div>
                    <button className='w-1/5 h-10 bg-[#87bdd8] hover:bg-blue-800 text-sm text-white mx-4 p-2 rounded' onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div className='h-1/3 bg-slate-500'></div>
            </div>

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block">

            </div>

            <div className="w-full px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-2/3 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-2/5 ">
                <div>
                    <p className='text-center font-bold tracking-widest mb-4'>Results</p>
                </div>
                <div className='flex justify-center space-x-10 mb-4'>
                    <button className={`px-4 py-2 rounded ${activeTab === 'articles' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800 border-2 border-blue-800'}`} onClick={() => handleTabChange('articles')}>Informatie</button>
                    <button className={`px-4 py-2 rounded ${activeTab === 'agenda' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800 border-2 border-blue-800'}`} onClick={() => handleTabChange('agenda')}>Agenda</button>
                </div>
                <div className='results-container fixed bottom-0 overflow-y-auto' style={{ maxHeight: '40vh' }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {/* Show text or agenda results based on activeTab */}
                            {activeTab === 'articles' && results.filter(result => result.source === 'articles').length > 0 && (
                                <ul className='w-full bg-slate-200 z-5 p-4 rounded text-xs'>
                                    {results.filter(result => result.source === 'articles').map((result, index) => (
                                        <li key={index} className='mb-4'>
                                            <p className='mt-2 text-sm' dangerouslySetInnerHTML={{ __html: `${highlightQuery(result.snippet, query)}` }} />
                                            <a href={`/texts/${result._id}`} target="_blank" rel="noopener noreferrer">
                                                <p><span className='text-2xl ml-4 mr-2 mt-4'>&#8640;</span> {`/texts/${result._id}`}
                                                </p>
                                            </a>

                                        </li>
                                    ))}
                                </ul>
                            )}

                            {activeTab === 'agenda' && results.filter(result => result.source === 'agenda').length > 0 && (
                                <ul className='w-full bg-slate-200 z-5 p-4 rounded text-xs'>
                                    {results
                                        .filter(result => result.source === 'agenda' && result.date_end_st !== null)
                                        .filter(result => {
                                            // Parse the end date into a Date object
                                            const endDate = new Date(result.date_end_st);
                                            const today = new Date(); // Get the current date

                                            // Compare dates: Keep only results where the end date is in the future or today
                                            return endDate >= today;
                                        })
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
                                            let imagePath = result.image_reference || "";

                                            if (imagePath.endsWith('?')) {
                                                imagePath = imagePath.slice(0, -1);
                                            }

                                            const title = result.title || "";

                                            console.log('imagePath:', imagePath); // Debugging step

                                            return (
                                                <li key={index} className='mb-4'>
                                                    {exhibitionUrl ? (
                                                        <a href={exhibitionUrl} target="_blank" rel="noopener noreferrer" className='mt-2 text-sm italic'>
                                                            {`${result.title}`}
                                                            {/* Show artists if present */}
                                                            {result.artists && result.artists !== 'N/A' && <span>{` - ${result.artists}`}</span>}
                                                        </a>
                                                    ) : (
                                                        <a href={locationUrl} target="_blank" rel="noopener noreferrer" className='mt-2 text-sm italic'>
                                                            {`${result.title}`}
                                                        </a>
                                                    )}
                                                    <p className='mt-2 text-sm' dangerouslySetInnerHTML={{ __html: `tot ${formatDate(result.date_end_st)}` }} />
                                                    <a href={locationUrl} target="_blank" rel="noopener noreferrer" className='mt-2 text-sm'>
                                                        {`in ${result.location}`}
                                                    </a>
                                                    <ImageDisplay
                                                        imagePath={imagePath}
                                                        title={title}
                                                        width="60"
                                                        height="60"
                                                    />
                                                </li>
                                            );
                                        })}
                                </ul>
                            )}


                            {/* Show message if no results */}
                            {results.length === 0 && (
                                <p>No results found.</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="w-full px-1 my-1 sm:px-1 sm:my-1 md:px-1 md:my-1 md:w-1/3 lg:px-1 lg:my-1 xl:w-2/5 ">

            </div>

            <div className="w-1/3 px-1 my-1 sm:w-full sm:px-1 sm:my-1 md:w-1/2 md:px-1 md:my-1 lg:px-1 lg:my-1 xl:w-1/5 hidden xl:block"></div>

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
