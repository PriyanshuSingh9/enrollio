import { NextResponse } from "next/server";

// GET /api/programs/[id] — Get program details
export async function GET(request, { params }) {
    return NextResponse.json({
        success: true,
        message: `Program ${params.id} — not yet implemented`,
        data: null,
    });
}

// PUT /api/programs/[id] — Update program
export async function PUT(request, { params }) {
    return NextResponse.json({
        success: true,
        message: `Update program ${params.id} — not yet implemented`,
    });
}

// DELETE /api/programs/[id] — Soft delete program
export async function DELETE(request, { params }) {
    return NextResponse.json({
        success: true,
        message: `Delete program ${params.id} — not yet implemented`,
    });
}
