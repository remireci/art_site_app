const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });


// Connection URI, replace with your actual MongoDB connection string
const uri = (process.env.MONGODB_URI || '').trim();

if (!uri) throw new Error("MongoDB uri is not defined");

// Database and collection names
const dbNameTexts = 'd_art_w_texts_r';
const collectionNameTexts = 'DWR_Texts';

const dbNameAgenda = 'Agenda';
const collectionNameAgenda = 'Agenda_AI';
const collectionNameLocations = 'Locations';
const collectionCities = 'city_mapping';


async function getLocations() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db(dbNameAgenda);
        const collection_agenda = database.collection(collectionNameAgenda);
        const collection_locations = database.collection(collectionNameLocations);

        const today = new Date().toISOString().split("T")[0]; // Get today's date in "yyyy-mm-dd" format

        const locations = await collection_locations
            .find({ show: { $ne: false } }) // Only select locations where show is not false
            .toArray();

        return locations.map(loc => ({
            domain: loc.domain, // Cleaned domain
            name: loc.location || loc.originalUrl, // Use original URL if name is missing
            city: loc.city,
            latitude: loc.coordinates?.latitude ?? null, // Ensure correct path
            longitude: loc.coordinates?.longitude ?? null,
            hasMultipleLocations: loc.hasMultipleLocations ?? false,// Ensure it matches LocationContextType
        }));
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
    } finally {
        await client.close();
    }
}

async function getCities() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbNameAgenda);
        const collection_cities = database.collection(collectionCities);

        // Query to fetch all documents and project only the `city` field
        const citiesCursor = collection_cities.find({}, { projection: { city: 1, _id: 1, alternatives: 1 } });

        // Convert the cursor to an array of cities
        const cities = await citiesCursor.toArray();

        // Extract the `city` field from each document and sort alphabetically
        const cityList = cities
            .map((doc) => ({
                id: doc._id,  // Use the MongoDB `_id` field as the id
                city: doc.city,
                alternatives: doc.alternatives,
            }))
            .sort((a, b) => a.city.localeCompare(b.city));

        return cityList;  // Return the array of cities
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    } finally {
        await client.close();
    }
}

module.exports = {
    getLocations,
    getCities,
};