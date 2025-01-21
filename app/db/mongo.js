import { MongoClient } from 'mongodb';

// Connection URI, replace with your actual MongoDB connection string
const uri = process.env.MONGODB_URI || 'your-connection-string';

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
  const client = new MongoClient(uri);

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
