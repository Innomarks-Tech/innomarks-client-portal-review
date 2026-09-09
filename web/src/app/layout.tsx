import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./staff-enhancements.css";
const sans = localFont({ src: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", variable: "--font-sans" });
const accent = localFont({ src: "../../node_modules/@fontsource-variable/lora/files/lora-latin-wght-italic.woff2", variable: "--font-accent" });

export const metadata: Metadata = {
  title: "Innomarks Technology Consulting — Technology that moves business forward",
  description:
    "Practical technology consulting, digital transformation, software, data, AI, and cybersecurity for your business.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${accent.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
