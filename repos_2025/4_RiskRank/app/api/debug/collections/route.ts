import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import mongoose from "mongoose";

/**
 * GET /api/debug/collections
 * Lists all collections and their document counts so we can find the right one.
 * Remove this route once the correct collection name is confirmed.
 */
export async function GET(req: NextRequest) {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) return NextResponse.json({ error: "No DB connection" }, { status: 500 });

    const collections = await db.listCollections().toArray();
    const result: Record<string, number> = {};

    for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        result[col.name] = count;
    }

    // Also try to grab a sample doc from each collection to confirm schema
    const samples: Record<string, unknown> = {};
    for (const col of collections) {
        const doc = await db.collection(col.name).findOne({});
        samples[col.name] = doc ? Object.keys(doc) : [];
    }

    return NextResponse.json({ collections: result, fields: samples });
}
