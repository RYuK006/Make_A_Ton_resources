import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

// Cache connection across hot-reloads in dev
const globalWithMongoose = global as typeof globalThis & {
    _mongooseConn: typeof mongoose | null;
    _mongoosePromise: Promise<typeof mongoose> | null;
};

if (!globalWithMongoose._mongooseConn) globalWithMongoose._mongooseConn = null;
if (!globalWithMongoose._mongoosePromise) globalWithMongoose._mongoosePromise = null;

export async function connectDB() {
    if (globalWithMongoose._mongooseConn) return globalWithMongoose._mongooseConn;

    if (!globalWithMongoose._mongoosePromise) {
        globalWithMongoose._mongoosePromise = mongoose.connect(MONGODB_URI);
    }

    globalWithMongoose._mongooseConn = await globalWithMongoose._mongoosePromise;
    return globalWithMongoose._mongooseConn;
}
