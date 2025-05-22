import { verifyCode } from '@/lib/codeUtils';
import { MongoClient, ObjectId } from 'mongodb';
import { cache } from 'react';

// Connection URI, replace with your actual MongoDB connection string
const uri = process.env.MONGODB_URI || 'your-connection-string';

if (!uri) throw new Error("MongoDB uri is not defined");

// Database and collection names
const dbNameTexts = 'd_art_w_texts_r';
const collectionNameTexts = 'DWR_Texts';

const dbNameAgenda = 'Agenda';
const collectionNameAgenda = 'Agenda_AI';
const collectionNameLocations = 'Locations';
const collectionCities = 'city_mapping';

const dbNameUsers = 'usersDb';
const collectionNameUsers = 'users';
const collectionNameLoginCodes = 'loginCodes';
const collectionNameAuthLogs = 'authLogs';

// Function to connect to MongoDB and retrieve documents from the "texts" collection
export async function getDocuments(query, skip, pageSize) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbNameTexts);
    const collection = database.collection(collectionNameTexts);

    // Fetch documents with pagination
    const documents = await collection
      .find(query)
      .skip(skip)  // Skip documents based on the current page
      .limit(pageSize)              // Limit the number of documents per page
      .toArray();

    return documents;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}


export async function getDocumentById(id) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbNameTexts);
    const collection = database.collection(collectionNameTexts);

    const query = { _id: new ObjectId(id) }


    // Fetch documents with pagination
    const text = await collection
      .findOne(query)


    return text;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}



// export async function getDocuments(query) {
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const database = client.db(dbNameTexts);
//     const collection = database.collection(collectionNameTexts);

//     // Perform the query, adjust as needed
//     const documents = await collection.find(query).toArray();

//     return documents;
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   } finally {
//     await client.close();
//     console.log('Disconnected from MongoDB');
//   }
// }

// Function to connect to MongoDB and retrieve Agenda items
export async function getAgendaItems(query) {

  const client = new MongoClient(uri);

  try {
    await client.connect();

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

export const getExhibitionsByDomain = async (domain) => {
  console.log("🌀 MongoDB query executing for domain:", domain);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    const todayISO = new Date().toISOString(); // Get today's date in ISO format

    // Normalize input domain (strip http, https, www)
    // const domainPattern = domain.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Construct MongoDB query
    const query = {
      domain,
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
};

function normalizeCity(city) {
  if (typeof city !== "string" || city.trim() === "") {
    console.error("Invalid city name provided:", city);
    return "";
  }

  // Decode URL-encoded string if necessary
  const decodedCity = decodeURIComponent(city);

  // Normalize the city name
  const normalized = decodedCity
    .replace(/\d+[A-Z]*\s*\|\s*/i, "")   // Remove leading numbers and pipe separator (e.g., '16E | ')
    .replace(/\s*\|.*$/, "")             // Remove country or extra details after '|' (e.g., '| FRANCE')
    .trim();                            // Trim whitespace

  return normalized;
}

function escapeRegExp(str) {
  // Escape special regex characters (e.g., ".", "|", "(", etc.)
  return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}


export async function getExhibitionsByCity(city) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    const todayISO = new Date().toISOString(); // Get today's date in ISO format

    // Normalize input domain (strip http, https, www)
    const normalizedCity = normalizeCity(city);

    if (!normalizedCity) {
      console.error("City name is invalid or could not be normalized.");
      return [];  // Exit if city normalization failed
    }

    const escapedCity = escapeRegExp(normalizedCity);

    console.log("the city normalized", escapedCity);

    // Construct MongoDB query
    const query = {
      city: {
        $regex: new RegExp(`^${escapedCity}(?=\s*\|.*$|$)`, "i")  // Match the city name and optionally allow extra details after |
      },       // Match city name (case-insensitive)
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

// Functionality to add using the city_mapping_collection:

// def get_exhibitions_by_city(city_name):
//     """Fetch exhibitions by city name, considering all possible alternatives."""
//     city_mapping = city_mapping_collection.find_one({"city": city_name})

//     if city_mapping:
//         city_variants = city_mapping["alternatives"]
//     else:
//         city_variants = [city_name]  # Fallback to the input name

//     # Fetch all locations matching any of the city variants
//     locations = collection_Locations.find({"city": {"$in": city_variants}})
//     location_ids = [loc["_id"] for loc in locations]

//     # Fetch exhibitions linked to these locations
//     exhibitions = collection_Exhibitions.find({"location_id": {"$in": location_ids}})

//     return list(exhibitions)


export async function getLocationByDomain(domain) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection_locations = database.collection(collectionNameLocations);

    return await collection_locations.findOne({ domain });
  } catch (error) {
    console.error(`Error fetching location for domain ${domain}:`, error);
    return null;
  } finally {
    await client.close();
  }
}


export async function getLocationById(id) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection_locations = database.collection(collectionNameLocations);
    console.log("the ID", id);

    return await collection_locations.findOne({ _id: id });
  } catch (error) {
    console.error(`Error fetching location for domain ${domain}:`, error);
    return null;
  } finally {
    await client.close();
  }
}


export async function getLocations() {
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

    // const locations = await collection_agenda
    //   .aggregate([
    //     {
    //       $match: {
    //         url: { $ne: null }, // Ensure URL exists
    //         date_end_st: { $gte: today }, // Only future events
    //       },
    //     },
    //     {
    //       $project: {
    //         originalUrl: "$url",
    //         cleanDomain: {
    //           $replaceAll: {
    //             input: {
    //               $replaceAll: {
    //                 input: { $replaceAll: { input: "$url", find: "https://", replacement: "" } },
    //                 find: "http://",
    //                 replacement: "",
    //               },
    //             },
    //             find: "www.",
    //             replacement: "",
    //           },
    //         },
    //         name: "$location",

    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: collectionNameLocations,
    //         localField: "cleanDomain",
    //         foreignField: "domain",
    //         as: "locationData",
    //       },
    //     },
    //     {
    //       $unwind: { path: "$locationData", preserveNullAndEmptyArrays: true },
    //     },
    //     {
    //       $match: {
    //         $or: [{ "locationData.show": { $ne: false } }, { locationData: { $exists: false } }],
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: "$cleanDomain", // Group by domain to ensure uniqueness
    //         name: { $first: "$name" }, // Take the first occurrence
    //         originalUrl: { $first: "$originalUrl" },
    //         city: { $first: "$locationData.city" },
    //         lat: { $first: { $ifNull: ["$locationData.coordinates.latitude", null] } }, // Default to null
    //         lon: { $first: { $ifNull: ["$locationData.coordinates.longitude", null] } },
    //       },
    //     },
    //     {
    //       $sort: { name: 1 }, // Sort alphabetically
    //     },
    //   ])
    //   .toArray();


    return locations.map(loc => ({
      _id: loc._id,
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


export const getUniqueCities = async () => {
  const cities = await db.collection('locations').distinct('city').toArray;
  return cities;
};


export async function getLocations_by_city(slug) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection_locations = database.collection(collectionNameLocations);

    // Query to fetch locations where the city matches and project only _id, domain, and city fields
    const locationsCursor = collection_locations.find(
      { slug: slug },
      { projection: { _id: 1, domain: 1, city: 1, slug: 1 } } // Project only the fields you need
    );

    // Convert cursor to array
    const locations = await locationsCursor.toArray();

    return locations;
  } catch (error) {
    console.error("Error fetching locations by city:", error);
    return [];
  } finally {
    await client.close();
  }
}


export async function getCities() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection_cities = database.collection(collectionCities);

    // Query to fetch all documents and project only the `city` field
    const citiesCursor = collection_cities.find({}, { projection: { city: 1, _id: 1, alternatives: 1, slug: 1 } });

    // Convert the cursor to an array of cities
    const cities = await citiesCursor.toArray();

    // Extract the `city` field from each document and sort alphabetically
    const cityList = cities
      .map((doc) => ({
        id: doc._id,  // Use the MongoDB `_id` field as the id
        city: doc.city,
        alternatives: doc.alternatives,
        slug: doc.slug,
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


export async function createUser(email, locationId) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbNameUsers);
    const users = database.collection(collectionNameUsers);

    const newUser = {
      email,
      locationId,
      createdAt: new Date(),
      role: "user",
      verified: "false",
    }

    const result = await users.insertOne(newUser);
    if (result.insertedId) {
      return {
        _id: result.insertedId,
        ...newUser,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error finding user with email ${email}:`, error);
    return null;
  } finally {
    await client.close();
  }
}


export async function findUser(email) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbNameUsers);
    const users = database.collection(collectionNameUsers);

    const user = await users.findOne({ email });

    return user;
  } catch (error) {
    console.error(`Error finding user with email ${email}:`, error);
    return null;
  } finally {
    await client.close();
  }
}


export async function updateUserField(email, field, value) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbNameUsers);
    const users = database.collection(collectionNameUsers);

    console.log("the email", email);

    const user = await users.updateOne({ email }, { $set: { [field]: value } });

    // return user;
  } catch (error) {
    console.error(`Error finding user with email ${email}:`, error);
    return null;
  } finally {
    await client.close();
  }
}


export async function updateLocationField(locationId, field, value) {

  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db(dbNameAgenda);
  const collection = database.collection(collectionNameLocations);
  // const database = client.db(dbNameLocations);
  await collection.updateOne(
    { _id: new ObjectId(locationId) },
    { $set: { [field]: value } }
  );
  await client.close();
}


export async function saveLoginCode(email, code, expires) {
  const client = new MongoClient(uri);

  await client.connect();
  const database = client.db(dbNameUsers);
  const loginCodes = database.collection(collectionNameLoginCodes);

  await loginCodes.updateOne(
    { email },
    { $set: { code, expires } },
    { upsert: true }
  );

  await client.close();
}


export async function checkLoginCode(email, code) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameUsers);
    const loginCodes = database.collection(collectionNameLoginCodes);

    const login = await loginCodes.findOne({ email });

    if (!login) {
      return { valid: false, reason: "No login code found for this email." };
    }

    const isValid = verifyCode(code, login.code);

    if (!isValid) {
      return { valid: false, reason: "Invalid code. Please check your code and try again." };
    }

    const now = new Date();
    if (login.expires && login.expires < now) {
      return { valid: false, reason: "Code has expired." };
    }

    return { valid: true };
  } catch (error) {
    console.error("Error checking login code:", error);
    return { valid: false, reason: "Internal error." };
  } finally {
    await client.close();
  }
}


export async function createAuthLog(log) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameUsers);
    const authLogs = database.collection(collectionNameAuthLogs);

    await authLogs.insertOne(log);

  } catch (error) {
    console.error("Error inserting auth log:", error);
    return { valid: false, reason: "Internal error." };
  } finally {
    await client.close();
  }
}


export async function updateImageReference(exhibitionId, imageUrl) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    const objectId = ObjectId.createFromHexString(exhibitionId);

    const result = await collection.updateOne(
      { _id: objectId },
      { $push: { image_reference: imageUrl } }
    );

    console.log("MongoDB update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating MongoDB:", error);
    throw error;
  } finally {
    await client.close();
  }
}


export async function deleteImageReference(exhibitionId, imagePath) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbNameAgenda);
    const collection = database.collection(collectionNameAgenda);

    // Convert exhibitionId to ObjectId before querying MongoDB
    const objectId = ObjectId.createFromHexString(exhibitionId);

    // Remove the image path from the `image_reference` array
    const result = await collection.updateOne(
      { _id: objectId },
      { $pull: { image_reference: imagePath } }
    );

    // Log the result of the operation
    console.log('MongoDB update result:', result);

    if (result.modifiedCount === 0) {

      console.log('Adding a question mark after the extension.')

      const cleanImagePath = addQuestionMarkIfNeeded(imagePath);

      console.log("from mongo function", cleanImagePath);

      const result = await collection.updateOne(
        { _id: objectId },
        { $pull: { image_reference: cleanImagePath } }
      );

      // Log the result of the operation
      console.log('MongoDB update result:', result);

      if (result.matchedCount === 0) {
        console.error('No document found with the given exhibitionId.');
      }
    }

    return result;
  } catch (error) {
    console.error('Error removing image reference from MongoDB:', error);
    throw error;
  } finally {
    await client.close();
  }
}



// export async function getLocations() {
//   const client = new MongoClient(uri);
//   try {
//     await client.connect();
//     const database = client.db(dbNameAgenda);
//     const collection_agenda = database.collection(collectionNameAgenda);
//     const collection_locations = database.collection(collectionNameLocations);

//     const locations = await collection_agenda
//       .aggregate([
//         {
//           $match: { url: { $ne: null } }, // Ensure URL exists
//         },
//         {
//           $project: {
//             originalUrl: "$url",
//             cleanDomain: {
//               $replaceAll: {
//                 input: {
//                   $replaceAll: {
//                     input: { $replaceAll: { input: "$url", find: "https://", replacement: "" } },
//                     find: "http://",
//                     replacement: "",
//                   },
//                 },
//                 find: "www.",
//                 replacement: "",
//               },
//             },
//             name: "$location",
//           },
//         },
//         {
//           $lookup: {
//             from: collectionNameLocations, // Join with locations collection
//             localField: "cleanDomain",
//             foreignField: "domain", // Assuming "domain" is the field in locations
//             as: "locationData",
//           },
//         },
//         {
//           $unwind: { path: "$locationData", preserveNullAndEmptyArrays: true },
//         },
//         {
//           $match: {
//             $or: [{ "locationData.show": { $ne: false } }, { locationData: { $exists: false } }],
//           },
//         },
//         {
//           $group: {
//             _id: "$cleanDomain", // Group by cleaned domain
//             name: { $first: "$name" }, // Pick the first location name
//             originalUrl: { $first: "$originalUrl" }, // Keep an example of original URL
//           },
//         },
//         {
//           $sort: { name: 1 }, // Sort alphabetically
//         },
//       ])
//       .toArray();

//     return locations.map(loc => ({
//       domain: loc._id, // Already cleaned
//       name: loc.name || loc.originalUrl, // Use original URL if name is missing
//     }));
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return [];
//   } finally {
//     await client.close();
//   }
// }