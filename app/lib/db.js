// db.js
// to prevent everytime we call the /api route using GET method
// a new connection to the database will be initiated
// (because of the call to mongoose.connect() method everytime)
// so cache the mongoose connection

import mongoose from 'mongoose';

// const { MONGO_URL } = process.env.MONGODB_URI;

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null};
}


export const dbConnect = async () => {
    if (cached.conn) return cached.conn;

    cached.conn = await mongoose.connect(process.env.MONGODB_URI);

    return cached.conn;
};


//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('MongoDB connected');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         process.exit(1);
//     }
// };

// export default connectDB;
