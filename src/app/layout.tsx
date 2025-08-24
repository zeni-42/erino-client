import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Erino | LMS",
  description: "The frontend for a Lead management system at Erino.in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`} >
          {children}
          <div className="w-full h-screen bg-gradient-to-tl from-orange-50 via-white to-orange-50 -z-50 fixed top-0" />
          <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
