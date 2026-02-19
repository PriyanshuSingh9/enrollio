export default function DashboardLoading() {
    return (
        <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
                <div className="h-8 w-72 bg-[var(--bg-surface)] rounded-lg mb-2" />
                <div className="h-4 w-56 bg-[var(--bg-surface)] rounded-lg" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <div className="h-3 w-28 bg-[var(--bg-surface-hover)] rounded mb-3" />
                        <div className="h-9 w-12 bg-[var(--bg-surface-hover)] rounded" />
                    </div>
                ))}
            </div>
            {/* ... more skeleton elements */}
        </div>
    );
}
