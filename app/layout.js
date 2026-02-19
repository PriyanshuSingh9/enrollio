import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Enrollio | Discover Events & Internships",
  description: "The ultimate platform for students and professionals to discover hackathons, workshops, and internships. Boost your career with Enrollio.",
  keywords: ["events", "internships", "hackathons", "workshops", "career", "enrollio", "student opportunities"],
  openGraph: {
    title: "Enrollio | Discover Events & Internships",
    description: "Join Enrollio to find the best events and internships tailored for your career growth.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider appearance={{ baseTheme: dark }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
