import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { ChevronRight, Tag, Flame, Percent } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Premium Flour Online | Iyosiola Foods",
  description:
    "Shop premium quality flour, semolina, wheat products, and baking essentials from Iyosiola Foods. Fresh products delivered to your doorstep across Nigeria.",
  keywords: [
    "buy flour online Nigeria",
    "premium flour",
    "baking flour Nigeria",
    "semolina online",
    "wheat flour",
    "buy flour online",
    "baking essentials Nigeria",
  ],
  openGraph: {
    title: "Shop Premium Flour Online | Iyosiola Foods",
    description: "Shop premium quality flour, semolina, and baking essentials. Fresh products delivered across Nigeria.",
    type: "website",
    images: [{ url: "/og-shop.jpg", width: 1200, height: 630, alt: "Iyosiola Foods Shop" }],
  },
};

export default async function ShopHomePage() {
  const topProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 }, isActive: true },
    take: 6,
  });

  const recommendedProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 }, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const categories = [
    { name: "Flour", icon: "🌾", link: "/shop?category=flour" },
    { name: "Semolina", icon: "🥣", link: "/shop?category=semolina" },
    { name: "Wheat", icon: "🍞", link: "/shop?category=wheat" },
    { name: "Groceries", icon: "🛒", link: "/shop?category=groceries" },
    { name: "Bulk Purchases", icon: "📦", link: "/shop?category=bulk" },
  ];

  return (
    <div className="space-y-6 container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 h-auto md:h-96">
        <div className="hidden md:flex flex-col w-64 bg-white rounded-md shadow-sm border border-gray-100 py-3 shrink-0">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={cat.link}
              className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between text-gray-700 hover:text-primary-600 transition-colors text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>

        <div className="flex-1 bg-yellow-50 rounded-md overflow-hidden relative group cursor-pointer shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-900 flex items-center p-8 md:p-12">
            <div className="text-white space-y-4 max-w-lg z-10">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Flash Sale 24h Only
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Premium Baking Flour,<br />Now 15% Off
              </h2>
              <p className="text-white/80 font-medium text-lg">
                Stock up your bakery with Iyosiola&apos;s finest grade.
              </p>
              <Link href="/shop" className="bg-white text-primary-900 px-6 py-3 rounded-md font-bold mt-4 hover:bg-gray-100 transition shadow-lg inline-block">
                SHOP NOW
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
              <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87.1,14.6,81.6,29.1,72.4,40.7C63.2,52.4,50.3,61.1,36.5,68.3C22.7,75.4,8.1,81,-6.6,83.1C-21.3,85.1,-36.1,83.5,-49.6,76.5C-63.1,69.5,-75.3,57.1,-81.4,42.2C-87.5,27.2,-87.5,9.6,-83.4,-6.4C-79.3,-22.4,-71.1,-36.8,-60,-48.6C-48.9,-60.4,-34.9,-69.7,-20.5,-75.3C-6.1,-81,8.7,-83.1,23.3,-83C37.9,-82.9,52.2,-80.6,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-56 gap-4 shrink-0">
          <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-100 p-4 flex flex-col justify-center items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <h4 className="font-bold text-gray-900">Hot Deals</h4>
            <p className="text-xs text-gray-500 mt-1">Daily discounts on staples.</p>
          </div>
          <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-100 p-4 flex flex-col justify-center items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Percent className="h-6 w-6 text-blue-500" />
            </div>
            <h4 className="font-bold text-gray-900">Bulk Offers</h4>
            <p className="text-xs text-gray-500 mt-1">Buy more, save more.</p>
          </div>
        </div>
      </div>

      {topProducts.length > 0 && (
        <section className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden mt-6">
          <div className="bg-red-500 px-4 py-3 border-b border-red-500 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Tag className="h-5 w-5 fill-white" /> Top Selling Items
            </h3>
            <Link href="/shop" className="text-white text-sm hover:underline font-medium">
              SEE ALL &gt;
            </Link>
          </div>
          <div className="p-4 bg-red-50/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="font-bold text-xl text-gray-900">Recommended for you</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
