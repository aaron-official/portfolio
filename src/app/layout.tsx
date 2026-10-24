import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// One self-hosted display face (~43 KB total). Body and labels use system fonts.
const display = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Aaron Kakembo | Software Engineer, Fintech & AI Engineer",
  description: "Portfolio of Aaron Kakembo, a software engineer in Kampala, Uganda, building mobile-money payment systems and AI tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
