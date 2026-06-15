import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Meeting Intelligence",
  description: "AI Meeting Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}