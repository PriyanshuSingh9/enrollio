export default function AdminDashboard() {
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-[var(--text-muted)] mb-8">Manage your events and internships.</p>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Total Programs", value: "—" },
                        { title: "Total Applicants", value: "—" },
                        { title: "Certificates Issued", value: "—" },
                    ].map((stat) => (
                        <div key={stat.title} className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                            <p className="text-sm text-[var(--text-muted)]">{stat.title}</p>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
