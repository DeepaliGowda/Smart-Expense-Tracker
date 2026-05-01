import type { Metadata } from "next";
import AppToaster from "@/components/AppToaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Expense Tracker",
  description: "Frontend-only expense tracker with localStorage persistence"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
