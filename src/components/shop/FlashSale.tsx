"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Zap, ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
};

export default function FlashSale({ products }: { products: Product[] }) {
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const flashEnd = data.flashSaleEndTime || data.settings?.flashSaleEndTime;
        if (flashEnd) {
          const end = new Date(flashEnd);
          if (end > new Date()) {
            setEndTime(end);
          } else {
            setIsExpired(true);
          }
        } else {
          // Default: end of today
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          setEndTime(today);
        }
      })
      .catch(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        setEndTime(today);
      });
  }, []);

  useEffect(() => {
    if (!endTime) return;
    const tick = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (products.length === 0 || isExpired) return null;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" />
          <h3 className="font-bold text-lg text-white">Flash Sale</h3>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-white/80 text-xs font-medium mr-1">Time Left:</span>
          {[
            { val: pad(timeLeft.hours), label: "H" },
            { val: pad(timeLeft.minutes), label: "M" },
            { val: pad(timeLeft.seconds), label: "S" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="bg-white text-red-600 font-bold text-sm px-2 py-1 rounded min-w-[32px] text-center tabular-nums">
                {t.val}
              </span>
              {i < 2 && <span className="text-white font-bold">:</span>}
            </div>
          ))}
        </div>

        <Link href="/shop" className="text-white text-sm font-medium hover:underline hidden sm:block">
          SEE ALL &gt;
        </Link>
      </div>

      {/* Products - Horizontal Scroll */}
      <div className="p-3 md:p-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {products.map((product) => {
            const fakeOriginal = product.price * 1.2;
            const discount = Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);

            return (
              <Link
                key={product.id}
                href={`/shop/product/${product.id}`}
                className="group flex-shrink-0 w-[160px] md:w-[180px] bg-white rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                      No Img
                    </div>
                  )}
                  {/* Discount Badge */}
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -{discount}%
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">{product.name}</p>
                  <div className="mt-auto">
                    <p className="font-bold text-sm text-gray-900">{formatMoney(product.price)}</p>
                    <p className="text-[10px] text-gray-400 line-through">{formatMoney(fakeOriginal)}</p>
                  </div>
                  {/* Stock bar */}
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(10, (product.stock / 50) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-orange-600 font-medium mt-1">{product.stock} items left</p>
                  </div>
                </div>

                {/* Add to cart hover */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({ id: product.id, name: product.name, price: product.price, stock: product.stock, image: product.image }, 1);
                  }}
                  className="mx-2 mb-2 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ShoppingCart className="h-3 w-3" /> ADD
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
