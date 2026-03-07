import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Iyosiola Foods | Premium Flour Millers & Distributors",
  description: "Secure, reliable, and premium flour products delivered right to you. Iyosiola Foods sets the standard in agricultural excellence.",
  keywords: ["flour", "baking", "agriculture", "nigeria flour", "premium flour", "iyosiola foods", "buy flour online"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-surface-50 text-surface-900`}>
        {/* Navigation placeholder */}
        <header className="w-full bg-white shadow-sm sticky top-0 z-50 h-20 flex items-center justify-between px-4 md:px-8 border-b border-surface-200">
             <Link href="/" className="flex items-center gap-3">
                 <Image src="/logo.jpg" alt="Iyosiola Group Logo" width={50} height={50} className="object-contain" />
                 <div className="font-bold text-2xl text-primary-900 tracking-tight hidden sm:block">IYOSIOLA GROUP</div>
             </Link>
             <nav className="hidden md:flex items-center gap-8 font-semibold text-primary-900">
                 <Link href="/" className="hover:text-accent-600 transition-colors">Group Overview</Link>
                 <Link href="/businesses" className="hover:text-accent-600 transition-colors">Our Businesses</Link>
                 <Link href="/investors" className="hover:text-accent-600 transition-colors">Investors</Link>
                 <Link href="/about" className="hover:text-accent-600 transition-colors">About the Group</Link>
                 <Link href="/contact" className="hover:text-accent-600 transition-colors">Contact</Link>
             </nav>
             <Link href="/businesses/flour" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md">
                 Flour Portal
             </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer placeholder */}
        <footer className="w-full bg-primary-900 text-white py-12 px-4 md:px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                       <Image src="/logo.jpg" alt="Iyosiola Group Logo" width={40} height={40} className="object-contain bg-white rounded p-1" />
                       <h3 className="font-bold text-xl text-accent-500">Iyosiola Group</h3>
                   </div>
                   <p className="text-sm text-surface-200">A diversified conglomerate driving growth and agricultural excellence across Africa.</p>
                </div>
                <div>
                   <h4 className="font-semibold mb-4 text-surface-50">Corporate Links</h4>
                   <ul className="space-y-2 text-sm text-surface-200">
                     <li><Link href="/businesses" className="hover:text-white transition-colors">Our Businesses</Link></li>
                     <li><Link href="/investors" className="hover:text-white transition-colors">Investor Relations</Link></li>
                     <li><Link href="/about" className="hover:text-white transition-colors">Leadership</Link></li>
                   </ul>
                </div>
                <div>
                   <h4 className="font-semibold mb-4 text-surface-50">Secure Shopping</h4>
                   <p className="text-sm text-surface-200">100% Secure Checkout powered by Paystack.</p>
                </div>
            </div>
            <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-surface-200">
                &copy; {new Date().getFullYear()} Iyosiola Group. All rights reserved.
            </div>
        </footer>
      </body>
    </html>
  );
}
