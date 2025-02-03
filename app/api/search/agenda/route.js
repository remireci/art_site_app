// @deprecated
import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, getAgendaItems } from '../../../db/mongo';

// process the date
const normalizeDate = (dateStr) => {
    // If the date string contains '/', replace it with ' '

    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        const monthName = new Date(`${month}/01/${year}`).toLocaleString('en', { month: 'long' });
        return `${day} ${monthName.toLowerCase()} ${year}`;
    }

    // If the date string contains month abbreviation, replace it with full month name
    const monthAbbreviations = {
        'jan': 'january',
        'feb': 'february',
        'mar': 'march',
        'apr': 'april',
        'may': 'may',
        'jun': 'june',
        'jul': 'july',
        'aug': 'august',
        'sep': 'september',
        'oct': 'october',
        'nov': 'november',
        'dec': 'december'
    };
    const regex = new RegExp(Object.keys(monthAbbreviations).join('|'), 'gi');
    return dateStr.replace(regex, match => monthAbbreviations[match.toLowerCase()]);
};


const compareAgendaItems = (item1, item2) => {
    // Compare titles based on partial matches

    const words1 = item1.title.split(' ').filter(word => word.length >= 4);
    const words2 = item2.title.split(' ').filter(word => word.length >= 4);

    const partialWordMatch = words1.some(word1 => {
        return words2.some(word2 => {
            return word1.toLowerCase() === word2.toLowerCase();
        });
    });

    // Compare date_end and location
    const dateMatch = normalizeDate(item1.date_end) === normalizeDate(item2.date_end);

    const locations1 = item1.location.split(' ').filter(word => word.length >= 4);
    const locations2 = item2.location.split(' ').filter(word => word.length >= 4);

    const partialLocationMatch = locations1.some(location1 => {
        return locations2.some(location2 => {
            return location1.toLowerCase() === location2.toLowerCase();
        });
    });

    // Return true if all conditions are met
    return partialWordMatch && dateMatch && partialLocationMatch;
}


export async function GET(req, res) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('terms');

    console.log("this is the query", query);

    const queryTerms = query ? query.match(/(?:[^\s"]+|"[^"]*")/g) || [] : [];

    try {
        // create conditions and query for agenda database
        const agendaConditions = queryTerms.map(term => {
            const isExactPhrase = term.startsWith('"') && term.endsWith('"');

            if (isExactPhrase) {
                const phraseWithoutQuotes = term.replace(/"/g, "");
                return { $or: [{ title: new RegExp(phraseWithoutQuotes, 'i') }, { subtitle: new RegExp(phraseWithoutQuotes, 'i') }, { text: new RegExp(phraseWithoutQuotes, 'i') }, { url: new RegExp(phraseWithoutQuotes, 'i') }] };
            } else {
                return {
                    $or: [
                        { title: { $regex: term, $options: 'i' } },
                        { location: { $regex: term, $options: 'i' } },
                        { artists: { $regex: term, $options: 'i' } },
                        { url: { $regex: term, $options: 'i' } },
                    ],
                };
            }
        });

        const agendaResults = await getAgendaItems({ $and: agendaConditions }, { url: 1, text: 1 });

        // Combine results from both databases into a single array
        const combinedResults = [...articleResults, ...agendaResults];

        // Map each result to include information about its source
        const data = combinedResults.map(result => ({
            url: result.url,
            snippet: result.hasOwnProperty('date_end') ? '' : getSentenceWithTerm(result.text, queryTerms[0]), // Assuming only the first search term for simplicity
            source: result.hasOwnProperty('date_end') ? 'agenda' : 'articles', // Assuming agenda items have a property named 'date_end'
            ...result // Spread all fields from the result object
        }));

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error searching texts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

