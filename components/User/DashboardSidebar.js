"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "Overview",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
            )
        },
        {
            href: "/dashboard/activity",
            label: "My Activity",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            )
        },
        {
            href: "/dashboard/profile",
            label: "Profile",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
    ];

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border-subtle hidden md:flex flex-col z-40 bg-[#0a0a0a]">
            <div className="p-6">
                <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                    Menu
                </h2>
                <nav className="flex flex-col gap-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                    ? "bg-[rgba(139,92,246,0.1)] text-accent"
                                    : "text-secondary hover:bg-surface-hover hover:text-white"
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-border-subtle">
                <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted">
                    Connect with opportunities
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
