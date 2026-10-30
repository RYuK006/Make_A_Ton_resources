import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/backend/auth";
import { connectDB } from "@/backend/db";
import Repository from "@/backend/models/Repository";
import {
    MAX_UPLOAD_BYTES,
    ALLOWED_UPLOAD_TYPES,
} from "@/backend/config/constants";
import mongoose from "mongoose";

/**
 * POST /api/upload
 *
 * Accepts a multipart/form-data body with:
 *   - file: Blob  — the code archive (zip/tar/gz)
 *   - project: string (optional) — display name for the repo
 *
 * Returns { repoId: string, filename: string, size: number }
 */
export async function POST(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json(
            { error: "Expected multipart/form-data" },
            { status: 400 }
        );
    }

    const file = formData.get("file") as File | null;
    if (!file) {
        return NextResponse.json(
            { error: "No file provided. Send a 'file' field." },
            { status: 400 }
        );
    }

    // Validate file size
    if (file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json(
            {
                error: `File too large. Maximum allowed size is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
            },
            { status: 413 }
        );
    }

    // Validate MIME type
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
        return NextResponse.json(
            {
                error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_UPLOAD_TYPES.join(", ")}`,
            },
            { status: 415 }
        );
    }

    // Derive a project name from the form field or the filename
    const projectName =
        (formData.get("project") as string | null) ||
        file.name.replace(/\.(zip|tar|gz|tgz)$/i, "");

    await connectDB();

    // Upsert a Repository record for this upload
    let repo = await Repository.findOne({
        name: projectName,
        ownerId: session.userId,
    });
    if (!repo) {
        repo = await Repository.create({
            name: projectName,
            ownerId: new mongoose.Types.ObjectId(session.userId),
        });
    }

    // NOTE: Actual file storage (e.g. to S3, GCS, or local disk) would happen here.
    // For now we acknowledge the upload and return the repository ID so the
    // caller can trigger a scan with POST /api/scan.

    return NextResponse.json(
        {
            repoId: repo._id.toString(),
            filename: file.name,
            size: file.size,
        },
        { status: 201 }
    );
}

/**
 * GET /api/upload
 * Returns the upload constraints (max size, allowed types) so the client
 * can validate before sending.
 */
export async function GET() {
    return NextResponse.json({
        maxSizeBytes: MAX_UPLOAD_BYTES,
        allowedTypes: ALLOWED_UPLOAD_TYPES,
        maxSizeMB: MAX_UPLOAD_BYTES / 1024 / 1024,
    });
}
