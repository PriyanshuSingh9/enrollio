export default function InternshipDetail({ params }) {
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Internship Detail</h1>
                <p className="text-[var(--text-muted)] mb-8">Internship ID: {params.id}</p>
                <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <p className="text-[var(--text-muted)]">Internship details, requirements, stipend, duration, and &quot;Apply Now&quot; CTA will be built here.</p>
                </div>
            </div>
        </div>
    );
}
