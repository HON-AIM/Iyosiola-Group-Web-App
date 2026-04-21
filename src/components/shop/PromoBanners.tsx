"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Truck,
  Percent,
  Gift,
  Tag,
  Star,
  ShoppingBag,
  Package,
} from "lucide-react";

type Promo = {
  id: string;
  title: string;
  subtitle: string | null;
  link: string | null;
  bgGradient: string | null;
  icon: string | null;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-7 w-7" />,
  Truck: <Truck className="h-7 w-7" />,
  Percent: <Percent className="h-7 w-7" />,
  Gift: <Gift className="h-7 w-7" />,
  Tag: <Tag className="h-7 w-7" />,
  Star: <Star className="h-7 w-7" />,
  ShoppingBag: <ShoppingBag className="h-7 w-7" />,
  Package: <Package className="h-7 w-7" />,
};

const DEFAULT_PROMOS: Promo[] = [
  {
    id: "default-1",
    title: "Bulk Orders",
    subtitle: "Save up to 25% on wholesale purchases",
    link: "/shop?category=bulk",
    bgGradient: "from-orange-500 to-red-500",
    icon: "Package",
  },
  {
    id: "default-2",
    title: "Free Delivery",
    subtitle: "On orders above ₦25,000 within Lagos",
    link: "/shop",
    bgGradient: "from-blue-500 to-indigo-600",
    icon: "Truck",
  },
];

export default function PromoBanners() {
  const [promos, setPromos] = useState<Promo[]>(DEFAULT_PROMOS);

  useEffect(() => {
    fetch("/api/admin/promos")
      .then((r) => r.json())
      .then((data) => {
        if (data.promos && data.promos.length > 0) {
          setPromos(data.promos);
        }
      })
      .catch(() => {});
  }, []);

  if (promos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {promos.slice(0, 4).map((promo) => (
        <Link
          key={promo.id}
          href={promo.link || "/shop"}
          className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${promo.bgGradient || "from-orange-500 to-red-500"} p-5 md:p-6 text-white group hover:shadow-lg transition-shadow`}
        >
          {/* Background decoration */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute left-0 bottom-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {ICON_MAP[promo.icon || "Zap"] || <Zap className="h-7 w-7" />}
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl">{promo.title}</h3>
              {promo.subtitle && (
                <p className="text-white/80 text-sm mt-0.5">{promo.subtitle}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
