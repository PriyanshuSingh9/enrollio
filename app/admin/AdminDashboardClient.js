"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDashboardClient() {
    const [hostOpen, setHostOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setHostOpen(!hostOpen)}
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent-hover transition-all duration-200 hover:shadow-[0_0_20px_var(--accent-glow)]"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Program
            </button>

            {hostOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setHostOpen(false)}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-52 rounded-xl border border-border-subtle bg-surface shadow-2xl z-50 overflow-hidden animate-fade-in-fast text-left">
                        <Link
                            href="/admin/events/new"
                            onClick={() => setHostOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-surface-hover hover:text-white transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Create Event
                        </Link>
                        <div className="border-t border-border-subtle" />
                        <Link
                            href="/admin/internships/new"
                            onClick={() => setHostOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:bg-surface-hover hover:text-white transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                            Create Internship
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
