export default function HomePage() {
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back 👋</h1>
                <p className="text-[var(--text-muted)] mb-8">Discover events and internships tailored for you.</p>
                <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <p className="text-[var(--text-muted)]">Personalized feed with search, filters, and program cards will be built here.</p>
                </div>
            </div>
        </div>
    );
}
