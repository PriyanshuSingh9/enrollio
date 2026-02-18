import { NextResponse } from "next/server";

// GET /api/programs — List programs (query: type, category, mode, search)
export async function GET() {
    return NextResponse.json({
        success: true,
        message: "Programs endpoint — not yet implemented",
        data: [],
    });
}

// POST /api/programs — Create event or internship
export async function POST() {
    return NextResponse.json(
        { success: true, message: "Create program — not yet implemented" },
        { status: 201 }
    );
}
