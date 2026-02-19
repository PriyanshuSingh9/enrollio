export default async function ManageInternship({ params }) {
    const { id } = await params;
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Manage Internship</h1>
                <p className="text-[var(--text-muted)] mb-8">Internship ID: {id}</p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <h2 className="text-lg font-semibold text-white mb-2">Internship Details</h2>
                        <p className="text-[var(--text-muted)]">Internship information and settings will appear here.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <h2 className="text-lg font-semibold text-white mb-2">Applicants</h2>
                        <p className="text-[var(--text-muted)]">Applicant list and status management will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
