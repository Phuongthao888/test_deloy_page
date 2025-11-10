import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Intro from "./intro";
import Navbar from "./navbar";
import Footer from "./footer";
import CustomToaster from "./customerToaster";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WINGSFORLYHAN",
  description: "WINGSFORLYHAN FANPAGE",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ScrollToTop />
          <Intro />
          <Navbar />
          <main className="w-full flex flex-col">{children}</main>
          <Footer />
          <CustomToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
