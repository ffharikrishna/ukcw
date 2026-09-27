import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
// Global styles first so component modules can override them.
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";
import { getSession } from "@/lib/session";
import { site } from "@/lib/site";

// Session state is read on every request so the first paint is never stale.
export const dynamic = "force-dynamic";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.name} (${site.shortName})`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  // Link embeds (Discord, X, iMessage...). Image built by `npm run og`.
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  // Also colours the strip down the side of Discord embeds.
  themeColor: "#8e6cff",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <SessionProvider initial={session}>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
