import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { site } from "@/lib/site-content";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    "Mads Project",
    "teatro musical",
    "escola de teatro musical",
    "canto",
    "dança",
    "teatro",
    "São Paulo",
  ],
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: site.logo,
        width: 500,
        height: 500,
        alt: "Mads Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.logo],
  },
  icons: {
    icon: site.logo,
    apple: site.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-mads-bg text-mads-text">{children}</body>
    </html>
  );
}
