export default function EventsListing() {
    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
                <p className="text-[var(--text-muted)] mb-8">Browse all active events. Filter by category, date, and mode.</p>
                <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <p className="text-[var(--text-muted)]">Event listing grid with filters and search will be built here.</p>
                </div>
            </div>
        </div>
    );
}
