// db.js (singleton pattern)
// to prevent everytime we call the /api route using GET method
// a new connection to the database will be initiated
// (because of the call to mongoose.connect() method everytime)
// so cache the mongoose connection

import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}


export const dbConnect = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
            throw new Error('Missing NEXT_PUBLIC_MONGODB_URI in environment');
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};