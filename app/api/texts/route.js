// this code we should keep as reference for a text search api!!!!!!!!!!!!!!!!
import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '../../db/mongo.js';

const getSentenceWithTerm = (text, searchTerm) => {

    // Remove brackets from the search term
    const cleanedSearchTerm = searchTerm.replace(/[()""]/g, '');
    // Split the text into sentences based on dots "."
    const cleanedText = text.replace(/<\/?p>/g, '');
    const sentences = cleanedText.split(/\.|!|\?/);

    // Find the index of the sentence containing the search term
    const searchTermIndex = sentences.findIndex(sentence => sentence.toLowerCase().includes(cleanedSearchTerm.toLowerCase()));

    // Function to add dots to a sentence
    const addDots = sentence => sentence.trim() + '.';

    // Get the sentence containing the search term
    const searchTermSentence = searchTermIndex !== -1 ? sentences[searchTermIndex] : '';

    // Get the sentence before the search term
    const sentenceBefore = searchTermIndex !== -1 && searchTermIndex > 0 ? sentences[searchTermIndex - 1] : '';

    // Get the sentence after the search term
    const sentenceAfter = searchTermIndex !== -1 && searchTermIndex < sentences.length - 1 ? sentences[searchTermIndex + 1] : '';

    // Combine the sentences with dots
    const combinedSentences = [sentenceBefore, searchTermSentence, sentenceAfter].map(addDots).join(' ');

    return combinedSentences;


    // Return the sentence containing the search term
    // return searchTermIndex !== -1 ? sentences[searchTermIndex].trim() : '';
};


export async function GET(req, res) {

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('terms');
    const queryTerms = query ? query.match(/(?:[^\s"]+|"[^"]*")/g) || [] : [];

    console.log("the query", queryTerms);

    try {
        // Create an array of conditions for each search term
        // ATTENTION!! Temporarily no articles search, we are now focusing on the calendar.
        // Anyway better to have a separated API for the search articles...

        const articleConditions = queryTerms.map(term => {
            const isExactPhrase = term.startsWith('"') && term.endsWith('"');

            if (isExactPhrase) {
                const phraseWithoutQuotes = term.replace(/"/g, "");
                return { $or: [{ title: new RegExp(phraseWithoutQuotes, 'i') }, { subtitle: new RegExp(phraseWithoutQuotes, 'i') }, { text: new RegExp(phraseWithoutQuotes, 'i') }, { url: new RegExp(phraseWithoutQuotes, 'i') }] };
            } else {
                return {
                    $or: [
                        { title: { $regex: term, $options: 'i' } },
                        { subtitle: { $regex: term, $options: 'i' } },
                        { text: { $regex: term, $options: 'i' } },
                        { url: { $regex: term, $options: 'i' } },
                    ],
                };
            }
        });

        console.log("here we are")

        // // Combine conditions using the $and operator
        const articleResults = await getDocuments({ $and: articleConditions }, { url: 1, text: 1 });

        // If queryTerms is empty, return early or skip the search
        if (queryTerms.length === 0) {
            // Return an empty array inside a valid Response object
            return NextResponse.json({ data: [] }, { status: 200 });
        }


        // // Map each result to include information about its source
        // const data = combinedResults.map(result => ({
        //     url: result.url,
        //     snippet: result.hasOwnProperty('date_end') ? '' : getSentenceWithTerm(result.text, queryTerms[0]), // Assuming only the first search term for simplicity
        //     source: result.hasOwnProperty('date_end') ? 'agenda' : 'articles', // Assuming agenda items have a property named 'date_end'
        //     ...result // Spread all fields from the result object
        // }));
        console.log(articleResults);

        return NextResponse.json({ articleResults }, { status: 200 });
    } catch (error) {
        console.error('Error searching texts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

