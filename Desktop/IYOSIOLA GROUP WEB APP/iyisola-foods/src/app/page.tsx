import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Iyosiola Group | Diversified Conglomerate Driving Growth in Africa",
  description:
    "Iyosiola Group is a premier African conglomerate committed to excellence in Flour Milling, Logistics & Supply Chain, and Agro-Allied industries. Shop premium flour products online.",
  keywords: [
    "Iyosiola Group",
    "flour Nigeria",
    "baking flour",
    "Nigerian conglomerate",
    "agro-allied Nigeria",
    "logistics Nigeria",
    "food distribution Africa",
  ],
  openGraph: {
    title: "Iyosiola Group | Diversified Conglomerate Driving Growth in Africa",
    description:
      "A premier African conglomerate committed to excellence across Flour Milling, Logistics, and Agro-Allied industries.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Iyosiola Group" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iyosiola Group | Diversified Conglomerate",
    description: "Premium flour products, integrated logistics, and sustainable agro-allied solutions.",
  },
};

export default function GroupHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <section
        className="relative h-[85vh] w-full flex items-center bg-primary-900 border-b-8 border-accent-500 overflow-hidden"
        style={{ backgroundImage: "url('/hero-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-primary-900/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center min-h-full py-20">
          <div className="w-full max-w-4xl text-center drop-shadow-2xl">
            <div className="inline-block bg-accent-500/90 text-white font-bold tracking-widest uppercase px-5 py-2 rounded-full text-sm mb-6 shadow-lg border border-accent-400">
              A Diversified Conglomerate
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              Driving Growth. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-surface-200 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                Building the Future.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mx-auto">
              Iyosiola Group is a premier African conglomerate committed to excellence across multiple sectors, enriching lives and powering economic development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/shop" className="interactive-hover px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-bold text-lg shadow-xl shadow-accent-500/20 text-center">
                Order Online
              </Link>
              <Link href="/businesses" className="interactive-hover px-8 py-4 bg-white hover:bg-surface-100 text-primary-900 rounded-lg font-bold text-lg shadow-xl shadow-white/10 text-center">
                Explore Our Businesses
              </Link>
              <Link href="/about" className="interactive-hover px-8 py-4 bg-transparent border-2 border-surface-400 hover:border-white text-white rounded-lg font-bold text-lg transition-colors text-center hidden md:block">
                Corporate Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 border-b border-surface-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-surface-100">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2">15+</div>
              <div className="text-surface-600 font-medium uppercase tracking-wider text-sm">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2">4</div>
              <div className="text-surface-600 font-medium uppercase tracking-wider text-sm">Core Divisions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2">500+</div>
              <div className="text-surface-600 font-medium uppercase tracking-wider text-sm">Dedicated Employees</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2">Nationwide</div>
              <div className="text-surface-600 font-medium uppercase tracking-wider text-sm">Operational Reach</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-lg font-bold text-accent-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-8 h-1 bg-accent-500 rounded-full"></span> Our Businesses
              </h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-primary-900 leading-tight">
                Diverse operations, unified by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                  quality.
                </span>
              </h3>
            </div>
            <Link
              href="/businesses"
              className="text-primary-600 font-bold hover:text-primary-800 flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              View All Divisions <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-200 interactive-hover group">
              <div className="h-64 bg-surface-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/60 group-hover:bg-primary-900/40 transition-colors z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <svg className="w-full h-full text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white font-bold text-2xl drop-shadow-md">Flour Milling</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-surface-600 leading-relaxed mb-6">
                  Producing premium, high-yield flour blends for commercial bakeries and households. Our flagship division driving food security.
                </p>
                <Link href="/businesses/flour" className="inline-block border-2 border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white font-bold py-2.5 px-6 rounded-lg transition-colors">
                  Visit Flour Portal
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-200 interactive-hover group">
              <div className="h-64 bg-surface-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/60 group-hover:bg-primary-900/40 transition-colors z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <svg className="w-full h-full text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white font-bold text-2xl drop-shadow-md">Logistics & Supply</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-surface-600 leading-relaxed mb-6">
                  Ensuring seamless distribution and integrated supply chain management across all 36 states of the federation.
                </p>
                <Link href="/businesses/logistics" className="inline-block text-primary-600 font-bold hover:text-primary-800 transition-colors uppercase tracking-wide text-sm">
                  Learn More &rarr;
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-200 interactive-hover group">
              <div className="h-64 bg-surface-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/60 group-hover:bg-primary-900/40 transition-colors z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <svg className="w-full h-full text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/></svg>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white font-bold text-2xl drop-shadow-md">Agro-Allied</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-surface-600 leading-relaxed mb-6">
                  Investing in sustainable farming practices to source the highest quality raw materials directly from local farmers.
                </p>
                <Link href="/businesses/agriculture" className="inline-block text-primary-600 font-bold hover:text-primary-800 transition-colors uppercase tracking-wide text-sm">
                  Learn More &rarr;
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface-100 py-20 px-4 border-t border-surface-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-6">
            Committed to Continuous Value Creation
          </h2>
          <p className="text-lg text-surface-600 mb-8 leading-relaxed">
            Whether you are a customer looking for premium products, or an investor seeking sustainable returns, Iyosiola Group provides unparalleled excellence.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-900 hover:bg-primary-800 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-transform hover:-translate-y-1"
          >
            Partner With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
