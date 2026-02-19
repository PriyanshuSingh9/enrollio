export default async function VerifyCertificate({ params }) {
    const { certId } = await params;
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-lg mx-auto text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Certificate Verification</h1>
                <p className="text-[var(--text-muted)] mb-6">Certificate ID: {certId}</p>
                <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <p className="text-[var(--text-muted)]">Certificate details (participant name, program, completion date, issuing organization) will be displayed here.</p>
                </div>
            </div>
        </div>
    );
}
