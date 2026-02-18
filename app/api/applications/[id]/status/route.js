import { NextResponse } from "next/server";

// PATCH /api/applications/[id]/status — Update applicant status
export async function PATCH(request, { params }) {
    return NextResponse.json({
        success: true,
        message: `Update status for application ${params.id} — not yet implemented`,
    });
}
