import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shop Premium Flour Online | Iyosiola Foods",
  description:
    "Shop premium quality flour, semolina, wheat products, and baking essentials from Iyosiola Foods. Fresh products delivered to your doorstep across Nigeria.",
};

const categories = [
  { name: "All Products", icon: "🛍️", count: 156, link: "/shop" },
  { name: "Baking Flour", icon: "🌾", count: 42, link: "/shop?category=BAKING" },
  { name: "Wheat Flour", icon: "🌾", count: 28, link: "/shop?category=WHEAT" },
  { name: "All-Purpose", icon: "🍞", count: 35, link: "/shop?category=ALL_PURPOSE" },
  { name: "Semolina", icon: "🥣", count: 18, link: "/shop?category=SEMOLINA" },
  { name: "Bundle Deals", icon: "📦", count: 12, link: "/shop?category=bundle" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const originalPrice = product.price * 1.25;
  const discount = Math.round((1 - product.price / originalPrice) * 100);

  return (
    <Link
      href={`/shop/product/${product.id}`}
      className="group bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200 flex flex-col h-full"
    >
      <div className="relative">
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
            -{discount}%
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
            Only {product.stock} left
          </div>
        )}
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 rounded-t-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={150}
              height={150}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-primary-600 font-semibold mb-1">Iyosiola Foods</div>
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="mb-2">
          <StarRating rating={4} />
        </div>

        <div className="mt-auto">
          <p className="font-bold text-lg text-gray-900">{formatMoney(product.price)}</p>
          <p className="text-xs text-gray-400 line-through">{formatMoney(originalPrice)}</p>
        </div>

        <button className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded text-sm transition-colors">
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

export default async function ShopHomePage() {
  const topProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 }, isActive: true },
    take: 8,
  });

  const recommendedProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 }, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const flashSaleProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 }, isActive: true },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Promo Bar */}
      <div className="bg-primary-900 text-white text-center py-2 px-4 text-sm">
        <span className="font-semibold">FREE DELIVERY</span> on orders above ₦25,000 | Use code: <span className="font-bold text-accent-400">IYOSIOLA10</span> for 10% off
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-primary-900 text-white px-4 py-3 font-bold">
                Shop by Category
              </div>
              <div className="py-2">
                {categories.map((cat, index) => (
                  <Link
                    key={index}
                    href={cat.link}
                    className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between text-gray-700 hover:text-primary-600 transition-colors text-sm border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-4 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-gray-900">Delivery</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Lagos: 1-2 Business Days</p>
                <p>• Other States: 3-5 Business Days</p>
                <p>• FREE on orders ₦25,000+</p>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-4 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-gray-900">Return Policy</span>
              </div>
              <p className="text-xs text-gray-600">
                7 days return policy. Items must be unused and in original packaging.
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-900 rounded-xl overflow-hidden mb-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 p-8 md:p-12 text-white">
                  <div className="inline-block bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    OFFICIAL STORE
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                    Premium Quality<br />Flour Delivered
                  </h2>
                  <p className="text-white/80 mb-6 max-w-md">
                    Nigeria&apos;s trusted flour brand. From household baking to industrial use, we have you covered.
                  </p>
                  <Link href="/shop" className="inline-block bg-white text-primary-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                    Shop Now
                  </Link>
                </div>
                <div className="hidden md:block w-1/3 p-8">
                  <div className="bg-white/10 rounded-full p-8">
                    <Image src="/logo.jpg" alt="Iyosiola Foods" width={200} height={200} className="object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sale Section */}
            {flashSaleProducts.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="bg-red-500 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <h3 className="font-bold text-lg text-white">FLASH SALES</h3>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-white text-sm">
                      <span>Ends in:</span>
                      <div className="flex gap-1">
                        <span className="bg-white text-red-600 font-bold px-2 py-1 rounded">04</span>:
                        <span className="bg-white text-red-600 font-bold px-2 py-1 rounded">32</span>:
                        <span className="bg-white text-red-600 font-bold px-2 py-1 rounded">18</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/shop?sale=flash" className="text-white text-sm font-semibold hover:underline">
                    See All →
                  </Link>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {flashSaleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Top Selling Section */}
            {topProducts.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="bg-primary-900 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h3 className="font-bold text-lg text-white">Top Selling Items</h3>
                  </div>
                  <Link href="/shop?sort=popular" className="text-white text-sm font-semibold hover:underline">
                    See All →
                  </Link>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {topProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Products / Recommended */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h3 className="font-bold text-lg text-gray-900">Just For You</h3>
                </div>
                <span className="text-sm text-gray-500">{recommendedProducts.length} products</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
