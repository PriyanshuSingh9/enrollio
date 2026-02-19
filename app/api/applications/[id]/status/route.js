import { NextResponse } from "next/server";

// PATCH /api/applications/[id]/status — Update applicant status
export async function PATCH(request, { params }) {
    const { id } = await params;
    return NextResponse.json({
        success: true,
        message: `Update status for application ${id} — not yet implemented`,
    });
}
