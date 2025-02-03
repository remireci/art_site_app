import { MongoClient } from 'mongodb';

// Connection URI, replace with your actual MongoDB connection string
const uri = process.env.MONGODB_URI || 'your-connection-string';

if (!uri) throw new Error("MongoDB uri is not defined");

// Database and collection names
const dbNameTexts = 'd_art_w_texts_r';
const collectionNameTexts = 'DWR_Texts';

const dbNameAgenda = 'Agenda';
const collectionNameAgenda = 'Agenda';

// Function to connect to MongoDB and retrieve documents from the "texts" collection
export async function getDocuments(query) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbNameTexts);
    const collection = database.collection(collectionNameTexts);

    // Perform the query, adjust as needed
    const documents = await collection.find(query).toArray();

    return documents;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Function to connect to MongoDB and retrieve Agenda items
export async function getAgendaItems(query) {

  console.log("from get agenda items, this is the uri", uri);

  const client = new MongoClient(uri);

  console.log("this is the client", client)

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    // Perform the query, adjust as needed
    const documents = await collection.find(query).toArray();

    return documents;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

export async function getExhibitionsByDomain(domain) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    const todayISO = new Date().toISOString(); // Get today's date in ISO format

    // Normalize input domain (strip http, https, www)
    const domainPattern = domain.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Construct MongoDB query
    const query = {
      url: { $regex: new RegExp(`(https?:\\/\\/)?(www\\.)?${domainPattern}`, "i") }, // Match domain variations
      date_end_st: { $gte: todayISO }, // End date must be in the future
      $or: [
        { date_begin_st: { $lte: todayISO } }, // If begin date exists, it must be in the past
        { date_begin_st: null }, // Or begin date can be missing
      ],
      show: { $ne: false }, // Exclude hidden documents
    };

    const exhibitions = await collection.find(query).toArray();

    return exhibitions;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}


export async function getLocations() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    const locations = await collection
      .aggregate([
        {
          $match: { url: { $ne: null } }, // Ensure URL exists
        },
        {
          $project: {
            originalUrl: "$url",
            cleanDomain: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: { $replaceAll: { input: "$url", find: "https://", replacement: "" } },
                    find: "http://",
                    replacement: "",
                  },
                },
                find: "www.",
                replacement: "",
              },
            },
            name: "$location",
          },
        },
        {
          $group: {
            _id: "$cleanDomain", // Group by cleaned domain
            name: { $first: "$name" }, // Pick the first location name
            originalUrl: { $first: "$originalUrl" }, // Keep an example of original URL
          },
        },
        {
          $sort: { name: 1 }, // Sort alphabetically
        },
      ])
      .toArray();

    return locations.map(loc => ({
      domain: loc._id, // Already cleaned
      name: loc.name || loc.originalUrl, // Use original URL if name is missing
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  } finally {
    await client.close();
  }
}
