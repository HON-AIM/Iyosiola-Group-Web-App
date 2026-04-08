"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";

type ProductActionProps = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string | null;
  };
};

export default function ProductActions({ product }: ProductActionProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => Math.min(product.stock, prev + 1));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <div className="space-y-3">
        <div className="bg-red-50 text-red-600 font-bold px-4 py-3 rounded-lg text-center border border-red-100">
          Out of Stock - Currently Unavailable
        </div>
        <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed">
          ADD TO CART
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-semibold">Quantity:</span>
        <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
          <button 
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors rounded-l-lg"
          >
            <Minus className="h-5 w-5" />
          </button>
          <input 
            type="number" 
            readOnly
            value={quantity}
            className="w-16 text-center font-bold text-lg focus:outline-none bg-transparent"
          />
          <button 
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors rounded-r-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          ({product.stock} available)
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            added 
              ? "bg-green-500 text-white" 
              : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {added ? "ADDED TO CART!" : "ADD TO CART"}
        </button>
        
        <button className="flex-1 py-4 rounded-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" />
          BUY NOW
        </button>
      </div>

      {/* Promo Message */}
      <p className="text-sm text-center text-gray-500 mt-2">
        ✓ Free delivery on orders above ₦25,000 | Use code: <span className="font-bold text-primary-600">IYOSIOLA10</span>
      </p>
    </div>
  );
}
