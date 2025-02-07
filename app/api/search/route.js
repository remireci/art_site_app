// api/search.js
import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, getAgendaItems } from '../../db/mongo';

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
  const queryTerms = query ? query.match(/(?:[^\s"]+|"[^"]*")/g) || [] : [];

  try {
    // Create an array of conditions for each search term
    // ATTENTION!! Temporarily no articles search, we are now focusing on the calendar.
    // Anyway better to have a separated API for the search articles...

    // const articleConditions = queryTerms.map(term => {
    //   const isExactPhrase = term.startsWith('"') && term.endsWith('"');

    //   if (isExactPhrase) {
    //     const phraseWithoutQuotes = term.replace(/"/g, "");
    //     return { $or: [{ title: new RegExp(phraseWithoutQuotes, 'i') }, { subtitle: new RegExp(phraseWithoutQuotes, 'i') }, { text: new RegExp(phraseWithoutQuotes, 'i') }, { url: new RegExp(phraseWithoutQuotes, 'i') }] };
    //   } else {
    //     return {
    //       $or: [
    //         { title: { $regex: term, $options: 'i' } },
    //         { subtitle: { $regex: term, $options: 'i' } },
    //         { text: { $regex: term, $options: 'i' } },
    //         { url: { $regex: term, $options: 'i' } },
    //       ],
    //     };
    //   }
    // });

    // // Combine conditions using the $and operator
    // const articleResults = await getDocuments({ $and: articleConditions }, { url: 1, text: 1 });
    const articleResults = [];

    // Similarly, create conditions and query for agenda database
    // const agendaConditions = queryTerms.map(term => {
    //   const isExactPhrase = term.startsWith('"') && term.endsWith('"');

    //   if (isExactPhrase) {
    //     const phraseWithoutQuotes = term.replace(/"/g, "");
    //     return { $or: [{ title: new RegExp(phraseWithoutQuotes, 'i') }, { subtitle: new RegExp(phraseWithoutQuotes, 'i') }, { text: new RegExp(phraseWithoutQuotes, 'i') }, { url: new RegExp(phraseWithoutQuotes, 'i') }] };
    //   } else {
    //     return {
    //       $or: [
    //         { title: { $regex: term, $options: 'i' } },
    //         { location: { $regex: term, $options: 'i' } },
    //         { artists: { $regex: term, $options: 'i' } },
    //         { url: { $regex: term, $options: 'i' } },
    //       ],
    //     };
    //   }
    // });

    // const agendaConditions = queryTerms.map((term) => {
    //   const isExactPhrase = term.startsWith('"') && term.endsWith('"');

    //   if (isExactPhrase) {
    //     const phraseWithoutQuotes = term.replace(/"/g, "");
    //     return {
    //       $and: [
    //         { show: { $ne: false } }, // Exclude documents where show is false
    //         {
    //           $or: [
    //             { title: new RegExp(phraseWithoutQuotes, "i") },
    //             { subtitle: new RegExp(phraseWithoutQuotes, "i") },
    //             { text: new RegExp(phraseWithoutQuotes, "i") },
    //             { url: new RegExp(phraseWithoutQuotes, "i") },
    //           ],
    //         },
    //       ],
    //     };
    //   } else {
    //     return {
    //       $and: [
    //         { show: { $ne: false } }, // Exclude documents where show is false
    //         {
    //           $or: [
    //             { title: { $regex: term, $options: "i" } },
    //             { location: { $regex: term, $options: "i" } },
    //             { artists: { $regex: term, $options: "i" } },
    //             { url: { $regex: term, $options: "i" } },
    //           ],
    //         },
    //       ],
    //     };
    //   }
    // });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to midnight

    // If queryTerms is empty, return early or skip the search
    if (queryTerms.length === 0) {
      // Return an empty array inside a valid Response object
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const agendaConditions = queryTerms
      .map((term) => {
        const isExactPhrase = term.startsWith('"') && term.endsWith('"');

        const textSearch = isExactPhrase
          ? {
            $or: [
              { title: new RegExp(term.replace(/"/g, ""), "i") },
              { subtitle: new RegExp(term.replace(/"/g, ""), "i") },
              { text: new RegExp(term.replace(/"/g, ""), "i") },
              { url: new RegExp(term.replace(/"/g, ""), "i") },
            ]
          }
          : {
            $or: [
              { title: { $regex: term, $options: "i" } },
              { location: { $regex: term, $options: "i" } },
              { artists: { $regex: term, $options: "i" } },
              { url: { $regex: term, $options: "i" } },
              { city: { $regex: term, $options: "i" } },
            ]
          };

        return {
          $and: [
            { show: { $ne: false } }, // Exclude hidden documents
            textSearch, // Apply text search
            { date_end_st: { $gte: today.toISOString() } }, // Filter where event is ongoing
            {
              $or: [
                { date_begin_st: { $lte: today.toISOString() } }, // Event has started
                { date_begin_st: { $eq: null } } // Or, date_begin_st is null
              ]
            }
          ]
        };
      })
      .filter(condition => condition !== null); // Remove any invalid or empty conditions

    // If no valid conditions, return early or set a fallback query
    if (agendaConditions.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 }); // return an empty data array
    }

    // Now safely pass the query to MongoDB
    const agendaResults = await getAgendaItems({ $and: agendaConditions }, { url: 1, text: 1 });

    console.log("the agenda results", agendaResults);

    // const uniqueAgendaResults = [];

    // agendaResults.forEach((item) => {
    //   // Check if the item is already in the uniqueAgendaResults array
    //   const isDuplicate = uniqueAgendaResults.some(uniqueItem => compareAgendaItems(item, uniqueItem));

    //   // If it's not a duplicate, add it to the uniqueAgendaResults array
    //   if (!isDuplicate) {
    //     uniqueAgendaResults.push(item);
    //   }
    // });

    // Now uniqueAgendaResults contains only the unique agenda items

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

