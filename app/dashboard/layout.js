import Navbar from "@/components/User/Navbar";
import DashboardSidebar from "@/components/User/DashboardSidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="flex pt-16">
                <DashboardSidebar />

                <main className="flex-1 md:ml-64 p-8 min-h-[calc(100vh-64px)]">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
