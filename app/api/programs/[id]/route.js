import { NextResponse } from "next/server";

// GET /api/programs/[id] — Get program details
export async function GET(request, { params }) {
    const { id } = await params;
    return NextResponse.json({
        success: true,
        message: `Program ${id} — not yet implemented`,
        data: null,
    });
}

// PUT /api/programs/[id] — Update program
export async function PUT(request, { params }) {
    const { id } = await params;
    return NextResponse.json({
        success: true,
        message: `Update program ${id} — not yet implemented`,
    });
}

// DELETE /api/programs/[id] — Soft delete program
export async function DELETE(request, { params }) {
    const { id } = await params;
    return NextResponse.json({
        success: true,
        message: `Delete program ${id} — not yet implemented`,
    });
}
