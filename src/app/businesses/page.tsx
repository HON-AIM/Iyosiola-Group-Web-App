import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Businesses | Iyosiola Group",
  description: "Explore Iyosiola Group's diverse business divisions including Flour Milling, Logistics & Supply Chain, and Agro-Allied operations across Nigeria.",
};

export default function BusinessesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("/hero-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            Our Business Divisions
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            A diversified conglomerate with operations spanning flour milling, logistics, and agro-allied industries.
          </p>
        </div>
      </section>

      {/* Flour Milling Division */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-block bg-accent-500 text-white text-sm font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4">
                Flour Milling
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-6">
                Premium Flour Products for Every Need
              </h2>
              <p className="text-lg text-surface-600 mb-6 leading-relaxed">
                Our flagship flour milling division produces high-quality flour for bakeries, households, and food manufacturers across Nigeria. Using state-of-the-art technology and rigorous quality control, we deliver premium products that meet international standards.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Premium Baking Flour",
                  "Whole Wheat Flour",
                  "Semolina (Wheat-based)",
                  "All-Purpose Flour",
                  "Custom Flour Blends"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-surface-700">
                    <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/businesses/flour/products" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                View Products
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-surface-200 rounded-2xl p-12 h-80 flex items-center justify-center">
                <svg className="w-32 h-32 text-primary-900/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Supply Chain Division */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-block bg-blue-600 text-white text-sm font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4">
                Logistics & Supply
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-6">
                Seamless Distribution Across Nigeria
              </h2>
              <p className="text-lg text-surface-600 mb-6 leading-relaxed">
                Our integrated logistics network ensures timely delivery of products across all 36 states of Nigeria. With a fleet of modern transport vehicles and a dedicated team, we guarantee efficient and reliable supply chain solutions.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "States Covered", value: "36" },
                  { label: "Warehouses", value: "12" },
                  { label: "Delivery Vehicles", value: "50+" },
                  { label: "Team Members", value: "200+" }
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-extrabold text-primary-600">{stat.value}</div>
                    <div className="text-sm text-surface-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-surface-200 rounded-2xl p-12 h-80 flex items-center justify-center">
                <svg className="w-32 h-32 text-blue-600/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agro-Allied Division */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-block bg-green-600 text-white text-sm font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4">
                Agro-Allied
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-6">
                Sustainable Farming, Quality Sourcing
              </h2>
              <p className="text-lg text-surface-600 mb-6 leading-relaxed">
                We invest in sustainable agricultural practices, partnering directly with local farmers to source the highest quality raw materials. Our agro-allied operations support rural communities while ensuring traceability and quality in our supply chain.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Direct partnerships with 500+ local farmers",
                  "Sustainable farming practices",
                  "Quality wheat and grain sourcing",
                  "Agricultural extension services",
                  "Fair trade partnerships"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-surface-700">
                    <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-surface-200 rounded-2xl p-12 h-80 flex items-center justify-center">
                <svg className="w-32 h-32 text-green-600/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Whether you are looking for premium flour products, logistics services, or agricultural partnerships, we are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </Link>
            <Link href="/shop" className="bg-white hover:bg-surface-100 text-primary-900 font-bold py-3 px-8 rounded-lg transition-colors">
              Shop Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
