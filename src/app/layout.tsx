import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand } from "@/content/site";

const title = `${brand.product} — ${brand.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: title, template: `%s — ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  keywords: ["focus timer", "deep work", "desk object", "screenless", "pomodoro", "focus device", "TACET"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: brand.locale, url: "/", siteName: brand.name, title, description: brand.description },
  twitter: { card: "summary_large_image", title, description: brand.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#d9dcd6", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
