import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NGX — POS & ERP",
  description: "Enterprise multi-company, multi-branch POS & ERP system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
