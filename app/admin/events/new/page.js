"use client";

import { createEvent } from "@/app/actions/programs";
import { useState } from "react";
import Link from "next/link";

export default function CreateEvent() {
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);

    async function handleSubmit(formData) {
        setIsLoading(true);
        try {
            await createEvent(formData);
        } catch (error) {
            console.error(error);
            alert("Failed to create event. Please try again.");
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#111] text-white scheme-dark flex flex-col">
            {/* Navbar / Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#111] z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="text-sm text-muted hover:text-white transition-colors"
                    >
                        &larr; Back
                    </Link>
                    <span className="text-sm text-muted">/</span>
                    <span className="text-sm font-medium">New Event</span>
                </div>
                <div>
                    {/* Placeholder for user or other actions */}
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full">
                <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-65px)]">

                    {/* LEFT COLUMN: Image Preview (Sticky) */}
                    <div className="lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] bg-[#111] border-b lg:border-b-0 lg:border-r border-white/5 p-8 flex flex-col items-center justify-center relative group overflow-hidden">

                        {/* Background/Preview */}
                        <div className="w-full max-w-sm aspect-square bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl relative group-hover:scale-[1.02] transition-transform duration-500 border border-white/10">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Event Cover"
                                    className="w-full h-full object-cover opacity-90"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-20 h-20 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <h3 className="text-base font-medium text-white/40">Event Cover</h3>
                                    <p className="text-xs text-white/20 mt-2">1:1 Aspect Ratio Recommended</p>
                                </div>
                            )}
                        </div>

                        {/* Image URL Input Overlay */}
                        <div className={`absolute bottom-8 left-8 right-8 transition-all duration-300 transform ${showImageInput || !imageUrl ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto'}`}>
                            <div className="bg-[#111]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                                    Add Cover Image URL
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        name="coverImage"
                                        placeholder="https://..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        onFocus={() => setShowImageInput(true)}
                                        onBlur={() => setShowImageInput(false)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form Data */}
                    <div className="p-6 md:p-12 pb-32 overflow-y-auto">
                        <div className="max-w-xl mx-auto space-y-10">

                            {/* Title */}
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="Event Name"
                                    className="w-full bg-transparent text-5xl font-bold text-white placeholder-white/20 focus:outline-none transition-colors"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-1">Start</label>
                                            <input
                                                type="datetime-local"
                                                name="startDate"
                                                required
                                                className="w-full bg-transparent text-white focus:outline-none scheme-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-1">End</label>
                                            <input
                                                type="datetime-local"
                                                name="endDate"
                                                className="w-full bg-transparent text-white focus:outline-none scheme-dark"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-4">
                                            <select
                                                name="mode"
                                                className="bg-transparent text-white focus:outline-none cursor-pointer text-sm font-medium"
                                            >
                                                <option value="online">Online</option>
                                                <option value="offline">In-Person</option>
                                                <option value="hybrid">Hybrid</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Add Event Location"
                                            className="w-full bg-transparent text-lg text-white placeholder-muted focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            name="description"
                                            required
                                            rows="4"
                                            placeholder="Add Description..."
                                            className="w-full bg-transparent text-lg text-white placeholder-white/20 focus:outline-none resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Options Card */}
                            <div className="pt-8 border-t border-white/5 space-y-6">
                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted group-hover:text-white transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white">Category</span>
                                    </div>
                                    <select
                                        name="category"
                                        className="bg-transparent text-right text-muted focus:text-white focus:outline-none cursor-pointer text-sm"
                                    >
                                        <option value="Workshop">Workshop</option>
                                        <option value="Webinar">Webinar</option>
                                        <option value="Hackathon">Hackathon</option>
                                        <option value="Meetup">Meetup</option>
                                        <option value="Conference">Conference</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted group-hover:text-white transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white">Registration Deadline</span>
                                    </div>
                                    <input
                                        type="date"
                                        name="deadline"
                                        required
                                        className="bg-transparent text-right text-muted focus:text-white focus:outline-none scheme-dark text-sm"
                                    />
                                </div>
                            </div>


                            {/* Action Bar */}
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl transition-all shadow-lg hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? "Creating Event..." : "Create Event"}
                                </button>
                            </div>

                        </div>
                    </div>

                </form>
            </main>
        </div>
    );
}
