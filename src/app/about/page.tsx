import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Truck, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "About Iyosi Foods | Premium Nigerian Flour Brand",
  description: "Learn about Iyosi Foods' legacy of excellence in producing premium flour products in Nigeria since 2009.",
  keywords: "Iyosi Foods, flour Nigeria, baking flour, Nigerian flour brand, premium flour",
  openGraph: {
    title: "About Iyosi Foods",
    description: "Nigeria's trusted flour brand. Quality you can taste since 2009.",
    type: "website",
    url: "https://iyosifoods.com/about",
    images: [
      {
        url: "/logo.jpg",
        width: 400,
        height: 400,
        alt: "Iyosi Foods Logo",
      },
    ],
  },
};

const milestones = [
  { year: "2009", event: "Founded with a vision for quality flour production" },
  { year: "2012", event: "Expanded production capacity by 200%" },
  { year: "2015", event: "Launched online store for nationwide delivery" },
  { year: "2020", event: "Reached 500+ satisfied customers milestone" },
  { year: "2024", event: "Introduced new premium product line" },
];

const values = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Every batch undergoes rigorous quality testing to ensure consistent excellence in every bag.",
  },
  {
    icon: Leaf,
    title: "Sustainable Sourcing",
    description: "We work directly with Nigerian wheat farmers, supporting local agriculture and ensuring fresh, quality ingredients.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "Nationwide delivery within 3-5 business days. Your flour arrives fresh, on time, every time.",
  },
  {
    icon: CheckCircle,
    title: "Customer First",
    description: "Our dedicated support team is always ready to help. Your satisfaction is our priority.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-700 text-white py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block bg-accent-500/20 text-accent-300 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 border border-accent-400/30">
            Since 2009
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">Iyosi Foods</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Nigeria&apos;s trusted flour brand, dedicated to delivering premium quality products that bring joy to your baking.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <Image
                  src="/logo.jpg"
                  alt="Iyosi Foods Logo"
                  width={400}
                  height={400}
                  className="object-contain mx-auto"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900">
              Our Story
            </h2>

            <div className="space-y-4 text-surface-700 text-lg leading-relaxed">
              <p>
                <strong className="text-primary-900">Iyosi Foods</strong> was born from a simple belief: every Nigerian deserves access to premium quality flour for their baking needs. Since 2009, we have been on a mission to transform the flour industry in Nigeria.
              </p>

              <p>
                What started as a small-scale operation has grown into one of Nigeria&apos;s most trusted flour brands. Our state-of-the-art milling facilities combine traditional expertise with modern technology to produce flour that consistently delivers exceptional results.
              </p>

              <p>
                From busy homemakers baking weekend treats to commercial bakeries producing thousands of loaves daily, Iyosi Foods has become synonymous with quality, reliability, and value. We source the finest wheat and employ rigorous quality control at every step to ensure perfection in every bag.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Explore Our Products
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-4">Our Values</h2>
            <p className="text-surface-600 max-w-2xl mx-auto">The principles that guide everything we do at Iyosi Foods.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-surface-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-surface-100"
              >
                <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-2">{value.title}</h3>
                <p className="text-surface-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-100 py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-4">Our Journey</h2>
            <p className="text-surface-600 max-w-2xl mx-auto">Key milestones in our commitment to excellence.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 md:-translate-x-px" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-6 ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-accent-500 rounded-full border-4 border-white shadow transform -translate-x-1/2 md:-translate-x-1/2" />
                    <div className="ml-12 md:ml-0 md:w-1/2 bg-white rounded-xl p-5 shadow-sm border border-surface-100">
                      <span className="inline-block bg-accent-100 text-accent-700 font-bold text-sm px-3 py-1 rounded-full mb-2">
                        {milestone.year}
                      </span>
                      <p className="text-surface-700">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-accent-600 to-accent-500 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Experience the Difference?</h2>
          <p className="text-accent-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who trust Iyosi Foods for their baking needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-primary-900 font-bold rounded-lg hover:bg-surface-50 transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
