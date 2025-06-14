import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import CookieConsent from "@/components/CookieConsent";
import Chatbot from "@/components/Chatbot";
import { CookieProvider } from "@/hooks/useCookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JobForge - Your Career Catalyst",
  description: "Modern job portal connecting talented professionals with amazing opportunities. AI-powered job matching and personalized career guidance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieProvider>
          <AuthProvider>
            {children}
            <CookieConsent />
            <Chatbot />
          </AuthProvider>
        </CookieProvider>
      </body>
    </html>
  );
}
