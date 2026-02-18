export default function Dashboard() {
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-[var(--text-muted)] mb-8">Your activity and profile at a glance.</p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <h2 className="text-lg font-semibold text-white mb-2">My Applications</h2>
                        <p className="text-[var(--text-muted)]">Quick overview of your recent applications.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <h2 className="text-lg font-semibold text-white mb-2">Certificates</h2>
                        <p className="text-[var(--text-muted)]">Download your earned certificates.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
