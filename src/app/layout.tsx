import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import IyosiHeader from "@/components/IyosiHeader";
import NewsletterForm from "@/components/NewsletterForm";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://iyosifoods.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Iyosi Foods | Premium Nigerian Flour Brand",
    template: "%s | Iyosi Foods",
  },
  description:
    "Nigeria's trusted flour brand. Shop premium baking flour, semolina, wheat products, and more. Quality you can taste. Nationwide delivery available.",
  keywords: [
    "Iyosi Foods",
    "flour Nigeria",
    "baking flour Nigeria",
    "buy flour online",
    "semolina Nigeria",
    "wheat flour Nigeria",
    "premium flour brand",
    "Nigerian flour",
  ],
  authors: [{ name: "Iyosi Foods", url: BASE_URL }],
  creator: "Iyosi Foods",
  publisher: "Iyosi Foods",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BASE_URL,
    siteName: "Iyosi Foods",
    title: "Iyosi Foods | Premium Nigerian Flour Brand",
    description:
      "Nigeria's trusted flour brand. Premium quality flour, nationwide delivery.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Iyosi Foods - Quality You Can Taste",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iyosi Foods | Premium Nigerian Flour Brand",
    description:
      "Shop premium flour, semolina, and wheat products. Quality you can taste.",
    images: ["/og-image.jpg"],
    creator: "@iyosifoods",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href={BASE_URL} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-surface-50 text-surface-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <Providers>
          <IyosiHeader />

          <main className="flex-grow flex flex-col" id="main-content" tabIndex={-1}>
            {children}
          </main>

          <footer className="w-full bg-primary-900 text-white">
            <div className="bg-primary-800 py-8 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Stay Updated</h3>
                    <p className="text-primary-200 text-sm">Subscribe for exclusive deals and fresh updates</p>
                  </div>
                  <NewsletterForm />
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src="/logo.jpg"
                      alt="Iyosi Foods Logo"
                      width={45}
                      height={45}
                      className="object-contain bg-white rounded p-1"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-white">Iyosi Foods</h3>
                      <p className="text-xs text-primary-300">Quality You Can Taste</p>
                    </div>
                  </div>
                  <p className="text-sm text-primary-200 leading-relaxed mb-4">
                    Nigeria&apos;s trusted flour brand since 2009. From households to commercial bakeries, we deliver premium quality.
                  </p>
                  <div className="flex gap-3">
                    <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="#" aria-label="YouTube" className="h-9 w-9 rounded-full bg-primary-800 hover:bg-red-600 flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                  <ul className="space-y-2.5 text-sm text-primary-200">
                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                    <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                    <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Products</h4>
                  <ul className="space-y-2.5 text-sm text-primary-200">
                    <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                    <li><Link href="/shop?category=BAKING" className="hover:text-white transition-colors">Baking Flour</Link></li>
                    <li><Link href="/shop?category=WHEAT" className="hover:text-white transition-colors">Wheat Flour</Link></li>
                    <li><Link href="/shop?category=ALL_PURPOSE" className="hover:text-white transition-colors">All-Purpose Flour</Link></li>
                    <li><Link href="/shop?category=SEMOLINA" className="hover:text-white transition-colors">Semolina</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
                  <ul className="space-y-2.5 text-sm text-primary-200">
                    <li><Link href="/dashboard/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                    <li><a href="tel:+2348004967465" className="hover:text-white transition-colors">0800-IYOSI</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
                  <ul className="space-y-2.5 text-sm text-primary-200">
                    <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-primary-800">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-primary-300 uppercase font-medium">We accept:</span>
                    <div className="flex gap-2">
                      <div className="bg-white rounded px-3 py-1.5 text-xs font-bold text-gray-800">VISA</div>
                      <div className="bg-white rounded px-3 py-1.5 text-xs font-bold text-gray-800">Mastercard</div>
                      <div className="bg-white rounded px-3 py-1.5 text-xs font-bold text-gray-800">Verve</div>
                      <div className="bg-white rounded px-3 py-1.5 text-xs font-bold text-gray-800">Transfer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-primary-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span>Secure Payments</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-primary-800 bg-primary-950">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between text-xs text-primary-400 gap-2">
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span>&copy; {new Date().getFullYear()} Iyosi Foods. All rights reserved.</span>
                    <span className="hidden md:inline">|</span>
                    <span>RC: 9454178</span>
                    <span className="hidden md:inline">|</span>
                    <span>Lagos, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Made with</span>
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>in Nigeria</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
