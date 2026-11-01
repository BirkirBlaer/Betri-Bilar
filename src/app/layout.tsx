import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { company, hero } from "@/content/site";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"], display: "swap" });

const title = `${company.name} — Bifreiðaverkstæði í Skeifunni, Reykjavík`;
const description = `${company.name} er bifreiðaverkstæði í Skeifunni 5c, Reykjavík, starfandi frá ${company.foundedYear}. ${hero.lede} Sími ${company.phone.display}.`;

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: { default: title, template: `%s — ${company.name}` },
  description,
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "is_IS",
    url: "/",
    siteName: company.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#151612",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="is" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a
          href="#efni"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-3 focus:text-ink"
        >
          Fara beint í efni
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
