"use client";

import React, { useState, useTransition } from "react";
import { submitApplication } from "@/app/actions/programs";
import Link from "next/link";

const STEPS = [
    { id: 1, label: "Personal Info" },
    { id: 2, label: "Academic Details" },
    { id: 3, label: "Resume & Extras" },
    { id: 4, label: "Review & Submit" },
];

export default function EnrollmentStepper({ userProfile, program, customFields }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState("next"); // 'next' or 'prev'
    const [isPending, startTransition] = useTransition();
    const [submitResult, setSubmitResult] = useState(null);

    // Form state — auto-filled from profile
    const [formData, setFormData] = useState({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        gender: userProfile?.gender || "",
        location: userProfile?.location || "",
        userType: userProfile?.userType || "",
        domain: userProfile?.domain || "",
        course: userProfile?.course || "",
        specialization: userProfile?.specialization || "",
        organization: userProfile?.organization || "",
        courseStartYear: userProfile?.courseStartYear || "",
        courseEndYear: userProfile?.courseEndYear || "",
        resumeFile: null,
        resumeFileName: "",
    });

    // Custom field responses
    const [customResponses, setCustomResponses] = useState(
        customFields?.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {}) || {}
    );

    const updateField = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const goNext = () => {
        if (currentStep < 4) {
            setDirection("next");
            setCurrentStep((s) => s + 1);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setDirection("prev");
            setCurrentStep((s) => s - 1);
        }
    };

    const handleSubmit = () => {
        startTransition(async () => {
            const responses = Object.entries(customResponses).map(([fieldId, value]) => ({
                fieldId: parseInt(fieldId),
                value,
            }));

            const result = await submitApplication({
                programId: program.id,
                responses,
            });
            setSubmitResult(result);
        });
    };

    // Success State
    if (submitResult?.success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
                {/* Success Icon */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-[var(--success)]/10 flex items-center justify-center border-2 border-[var(--success)]/30 success-pulse">
                        <svg className="w-12 h-12 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="checkmark-draw" />
                        </svg>
                    </div>
                    {/* Decorative particles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full confetti-particle"
                                style={{
                                    background: i % 2 === 0 ? "var(--accent)" : "var(--success)",
                                    animationDelay: `${i * 0.1}s`,
                                    transform: `rotate(${i * 45}deg) translateY(-50px)`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-3">Application Submitted!</h2>
                <p className="text-[var(--text-secondary)] mb-2 text-lg">
                    You've successfully applied to <span className="text-white font-medium">{program.title}</span>
                </p>
                <p className="text-[var(--text-muted)] mb-8">
                    You'll be notified once your application has been reviewed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/internships"
                        className="px-8 py-3 border border-[var(--border-subtle)] text-white font-medium rounded-xl hover:bg-[var(--bg-surface-hover)] transition-all"
                    >
                        Browse More Internships
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Stepper Progress Bar */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--border-subtle)]" />
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-[var(--accent)] transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />

                    {STEPS.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        return (
                            <div key={step.id} className="relative flex flex-col items-center z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                                        ${isCompleted
                                            ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30"
                                            : isActive
                                                ? "bg-[var(--bg-surface)] border-[var(--accent)] text-[var(--accent)] shadow-lg shadow-[var(--accent)]/20"
                                                : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <span className={`mt-2 text-xs font-medium hidden sm:block transition-colors ${isActive ? "text-white" : isCompleted ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Error message */}
            {submitResult && !submitResult.success && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {submitResult.message}
                </div>
            )}

            {/* Step Content */}
            <div
                className={`p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] step-transition ${direction === "next" ? "slide-in-right" : "slide-in-left"}`}
                key={currentStep}
            >
                {currentStep === 1 && (
                    <StepPersonalInfo formData={formData} updateField={updateField} profileFilled={!!userProfile?.name} />
                )}
                {currentStep === 2 && (
                    <StepAcademicDetails formData={formData} updateField={updateField} profileFilled={!!userProfile?.course} />
                )}
                {currentStep === 3 && (
                    <StepResumeExtras
                        formData={formData}
                        updateField={updateField}
                        customFields={customFields}
                        customResponses={customResponses}
                        setCustomResponses={setCustomResponses}
                    />
                )}
                {currentStep === 4 && (
                    <StepReview formData={formData} program={program} customFields={customFields} customResponses={customResponses} />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
                {currentStep > 1 ? (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 px-6 py-3 text-[var(--text-secondary)] hover:text-white transition-colors rounded-xl hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-subtle)]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                ) : (
                    <div />
                )}

                {currentStep < 4 ? (
                    <button
                        onClick={goNext}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--accent)]/25"
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Application
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ─── Auto-fill Badge ─────────────────────────────── */
function AutoFillBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Auto-filled from profile
        </span>
    );
}

/* ─── Input Component ─────────────────────────────── */
function StepInput({ label, type = "text", value, onChange, placeholder, disabled, required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {label} {required && <span className="text-[var(--accent)]">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
        </div>
    );
}

/* ─── Step 1: Personal Info ───────────────────────── */
function StepPersonalInfo({ formData, updateField, profileFilled }) {
    const genderOptions = ["Male", "Female", "More Options"];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Confirm your basic details</p>
                </div>
                {profileFilled && <AutoFillBadge />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StepInput
                    label="Full Name"
                    value={formData.name}
                    onChange={(v) => updateField("name", v)}
                    placeholder="John Doe"
                    required
                />
                <StepInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={() => { }}
                    disabled
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    Gender <span className="text-[var(--accent)]">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {genderOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => updateField("gender", option)}
                            className={`px-5 py-2 rounded-full border text-sm transition-all ${formData.gender === option
                                ? "border-[var(--accent)] text-white bg-[var(--accent)]/10"
                                : "border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:border-[var(--border-light)]"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <StepInput
                label="Current Location"
                value={formData.location}
                onChange={(v) => updateField("location", v)}
                placeholder="City, State"
                required
            />
        </div>
    );
}

/* ─── Step 2: Academic Details ────────────────────── */
function StepAcademicDetails({ formData, updateField, profileFilled }) {
    const userTypes = ["College Student", "Professional", "School Student", "Fresher"];
    const domains = ["Management", "Engineering", "Arts & Science", "Medicine", "Law", "Others"];
    const courses = ["B.Tech/BE", "B.Sc", "BBA", "BCA", "M.Tech", "MBA", "Other"];
    const specializations = ["Computer Science", "Artificial Intelligence", "Information Technology", "Electronics", "Mechanical", "Civil", "Other"];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Academic & Professional Details</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Tell us about your background</p>
                </div>
                {profileFilled && <AutoFillBadge />}
            </div>

            {/* User Type */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    I am a <span className="text-[var(--accent)]">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {userTypes.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => updateField("userType", type)}
                            className={`px-5 py-2 rounded-full border text-sm transition-all ${formData.userType === type
                                ? "border-[var(--accent)] text-white bg-[var(--accent)]/10"
                                : "border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:border-[var(--border-light)]"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Domain */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    Domain <span className="text-[var(--accent)]">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {domains.map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => updateField("domain", d)}
                            className={`px-5 py-2 rounded-full border text-sm transition-all ${formData.domain === d
                                ? "border-[var(--accent)] text-white bg-[var(--accent)]/10"
                                : "border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:border-[var(--border-light)]"
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course + Specialization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Course <span className="text-[var(--accent)]">*</span>
                    </label>
                    <select
                        value={formData.course}
                        onChange={(e) => updateField("course", e.target.value)}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none"
                    >
                        <option value="" disabled>Select Course</option>
                        {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Specialization <span className="text-[var(--accent)]">*</span>
                    </label>
                    <select
                        value={formData.specialization}
                        onChange={(e) => updateField("specialization", e.target.value)}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none"
                    >
                        <option value="" disabled>Select Specialization</option>
                        {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Organization */}
            <StepInput
                label="Organization / College"
                value={formData.organization}
                onChange={(v) => updateField("organization", v)}
                placeholder="University or Company Name"
                required
            />

            {/* Course Duration */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Course Duration</label>
                <div className="grid grid-cols-2 gap-4">
                    <StepInput
                        label=""
                        type="number"
                        value={formData.courseStartYear}
                        onChange={(v) => updateField("courseStartYear", v)}
                        placeholder="Start Year"
                    />
                    <StepInput
                        label=""
                        type="number"
                        value={formData.courseEndYear}
                        onChange={(v) => updateField("courseEndYear", v)}
                        placeholder="End Year"
                    />
                </div>
            </div>
        </div>
    );
}

/* ─── Step 3: Resume & Extras ─────────────────────── */
function StepResumeExtras({ formData, updateField, customFields, customResponses, setCustomResponses }) {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            updateField("resumeFile", file);
            updateField("resumeFileName", file.name);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white">Resume & Additional Details</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Upload your resume and answer program-specific questions</p>
            </div>

            {/* Resume Upload */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    Upload Resume <span className="text-xs text-[var(--text-muted)]">(PDF, DOC, DOCX)</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="flex items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-elevated)] cursor-pointer hover:border-[var(--accent)]/50 hover:bg-[var(--bg-surface-hover)] transition-all group"
                    >
                        {formData.resumeFileName ? (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium">{formData.resumeFileName}</p>
                                    <p className="text-xs text-[var(--text-muted)]">Click to change file</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <svg className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-[var(--text-secondary)] font-medium">
                                    Drop your resume here or <span className="text-[var(--accent)]">browse</span>
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Maximum file size: 5MB</p>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* Custom Fields */}
            {customFields && customFields.length > 0 && (
                <div className="space-y-5 pt-4 border-t border-[var(--border-subtle)]">
                    <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">Program Questions</p>
                    {customFields.map((field) => (
                        <div key={field.id}>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                {field.label} {field.isRequired && <span className="text-[var(--accent)]">*</span>}
                            </label>
                            {field.fieldType === "textarea" ? (
                                <textarea
                                    rows={3}
                                    value={customResponses[field.id] || ""}
                                    onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all resize-none"
                                    placeholder="Your answer..."
                                />
                            ) : field.fieldType === "url" ? (
                                <input
                                    type="url"
                                    value={customResponses[field.id] || ""}
                                    onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all"
                                    placeholder="https://example.com"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={customResponses[field.id] || ""}
                                    onChange={(e) => setCustomResponses((prev) => ({ ...prev, [field.id]: e.target.value }))}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all"
                                    placeholder="Your answer..."
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Step 4: Review & Submit ─────────────────────── */
function StepReview({ formData, program, customFields, customResponses }) {
    const sections = [
        {
            title: "Personal Information",
            items: [
                { label: "Name", value: formData.name },
                { label: "Email", value: formData.email },
                { label: "Gender", value: formData.gender },
                { label: "Location", value: formData.location },
            ],
        },
        {
            title: "Academic Details",
            items: [
                { label: "Type", value: formData.userType },
                { label: "Domain", value: formData.domain },
                { label: "Course", value: formData.course },
                { label: "Specialization", value: formData.specialization },
                { label: "Organization", value: formData.organization },
                { label: "Duration", value: formData.courseStartYear && formData.courseEndYear ? `${formData.courseStartYear} - ${formData.courseEndYear}` : "" },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white">Review Your Application</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                    Please review everything before submitting your application for <span className="text-white">{program.title}</span>
                </p>
            </div>

            {sections.map((section) => (
                <div key={section.title} className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">{section.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.items.map((item) => (
                            item.value && (
                                <div key={item.label}>
                                    <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                                    <p className="text-white font-medium">{item.value}</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            ))}

            {/* Resume */}
            {formData.resumeFileName && (
                <div className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Resume</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-white font-medium">{formData.resumeFileName}</span>
                    </div>
                </div>
            )}

            {/* Custom Field Responses */}
            {customFields && customFields.length > 0 && (
                <div className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Program Questions</h4>
                    <div className="space-y-3">
                        {customFields.map((field) => (
                            customResponses[field.id] && (
                                <div key={field.id}>
                                    <p className="text-xs text-[var(--text-muted)]">{field.label}</p>
                                    <p className="text-white">{customResponses[field.id]}</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
