// In the dynamic page component
"use client"
import { useEffect, useState } from 'react';

const TextPage = ({ params }) => {

    console.log(params);
    //   const { textId } = router.query;
    const [articleData, setArticleData] = useState([]);

    useEffect(() => {
        // Check if localStorage is available (i.e., if we're in the browser environment)
        if (typeof window !== 'undefined') {
            const storedArticles = JSON.parse(localStorage.getItem("articles"));
            if (storedArticles) {
                setArticleData(storedArticles);
            }            
            console.log(storedArticles);
        }
        
    }, []);


    //   useEffect(() => {
    //     const data = router.query.data ? JSON.parse(decodeURIComponent(router.query.data)) : [];
    //     setArticleData(data);
    //   }, [router.query.data]);

    // Render the text content using articleData

    return (
        <div>
            <h1>Text Page</h1>
            {/* <p>Text ID: {textId}</p> */}
            {/* Render the text content using articleData */}
        </div>
    );
};

export default TextPage;
