import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/backend/db";
import User from "@/backend/models/User";
import { signToken, COOKIE } from "@/backend/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        await connectDB();

        // Support both full email ("admin@zerohour.dev") and username-only ("admin").
        // If the input has no "@", search for any user whose email starts with that prefix.
        const input = email.trim();
        let user;
        if (input.includes("@")) {
            user = await User.findOne({ email: input.toLowerCase() });
        } else {
            // Escape special regex characters then match "username@..."
            const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            user = await User.findOne({ email: new RegExp(`^${escaped}@`, "i") });
        }

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signToken({ userId: user._id.toString(), email: user.email });

        const res = NextResponse.json({ ok: true, email: user.email });
        res.cookies.set(COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
        return res;
    } catch (err) {
        console.error("[auth/login]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
