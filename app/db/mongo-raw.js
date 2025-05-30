const { MongoClient } = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.local' });
}

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

        const today = new Date().toISOString().split("T")[0];

        const query = {
            show: { $ne: false },
            hasExhibitions: true,
        };

        const locations = await collection_locations.find(query).toArray();

        return locations.map(loc => ({
            _id: loc._id,
            domain: loc.domain,
            name: loc.location || loc.originalUrl,
            city: loc.city,
            domain_slug: loc.domain_slug,
            latitude: loc.coordinates?.latitude ?? null,
            longitude: loc.coordinates?.longitude ?? null,
            hasMultipleLocations: loc.hasMultipleLocations ?? false,
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

        const query = { hasExhibitions: true };

        const citiesCursor = collection_cities.find(query, {
            projection: { city: 1, _id: 1, alternatives: 1, slug: 1 },
        });

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