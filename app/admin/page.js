"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { user } = useUser();
  const [hostOpen, setHostOpen] = useState(false);

  const firstName = user?.firstName || "there";

  const stats = [
    {
      label: "Total Programs",
      value: "0",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      label: "Active Events",
      value: "0",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Active Internships",
      value: "0",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      ),
    },
    {
      label: "Total Applicants",
      value: "0",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-primary)] pt-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-[var(--text-muted)] mt-1 text-sm">
              Here&apos;s your organizer overview
            </p>
          </div>
          <div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12"
                },
                variables: {
                  avatarSize: "48px"
                }
              }}
            />
          </div>

        </div>

        {/* ── Stats ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-light)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Content Grid ───────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Your Programs — left 3 cols */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-white mb-4">Your Programs</h2>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 text-center">
              {/* Empty state */}
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="12" x2="12" y2="18" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">No programs yet</p>
              <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs mx-auto">
                Create your first event or internship to start receiving applications.
              </p>
              <div className="relative inline-block">
                <button
                  onClick={() => setHostOpen(!hostOpen)}
                  className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-[0_0_20px_var(--accent-glow)]"
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
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-52 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl z-50 overflow-hidden animate-fade-in-fast text-left">
                      <Link
                        href="/admin/events/new"
                        onClick={() => setHostOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-white transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Create Event
                      </Link>
                      <div className="border-t border-[var(--border-subtle)]" />
                      <Link
                        href="/admin/internships/new"
                        onClick={() => setHostOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-white transition-colors"
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
            </div>
          </div>

          {/* Quick Actions — right 2 cols */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              <Link href="/admin/events/new">
                <div className="group p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-hover)] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-[var(--accent)] transition-colors">
                        Create Event
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Workshops, hackathons, webinars & more
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link href="/admin/internships/new">
                <div className="group p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-hover)] transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.1)] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-[var(--accent)] transition-colors">
                        Create Internship
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Remote, onsite, or hybrid opportunities
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[var(--accent)] group-hover:translate-x-0.5 transition-all shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Recent Activity placeholder */}
              <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white">Recent Activity</p>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  No activity yet. Your recent actions will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
