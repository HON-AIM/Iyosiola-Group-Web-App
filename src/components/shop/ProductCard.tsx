"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    }, 1);
  };

  return (
    <Link 
      href={`/shop/product/${product.id}`}
      className="group bg-white rounded-md shadow-sm border border-transparent hover:border-primary-200 hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
             No Image
          </div>
        )}
        
        {/* Badges */}
         {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
           {product.name}
        </h3>
        
        <div className="mt-auto pt-2">
          <p className="font-bold text-base text-gray-900">{formatMoney(product.price)}</p>
          {/* Mock fake original price for Jumia-style discount aesthetic */}
          <p className="text-xs text-gray-400 line-through mt-0.5">{formatMoney(product.price * 1.15)}</p>
        </div>

        {/* Add to Cart Button (Only visible on hover on large screens, or always on mobile) */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-2 rounded shadow text-sm transition-all md:opacity-0 md:-translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        >
          {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </Link>
  );
}
