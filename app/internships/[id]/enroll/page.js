export default async function InternshipEnroll({ params }) {
    const { id } = await params;
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Enrollment Stepper</h1>
                <p className="text-[var(--text-muted)] mb-8">Enrolling for Internship ID: {id}</p>
                <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <p className="text-[var(--text-muted)]">Multi-step enrollment form (Personal Info → Background → Program Questions → Review) will be built here.</p>
                </div>
            </div>
        </div>
    );
}
