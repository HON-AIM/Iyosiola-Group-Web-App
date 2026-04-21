"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";

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
  };

  if (product.stock === 0) {
    return (
      <div className="mt-6 flex flex-col gap-4">
         <div className="bg-red-50 text-red-600 font-bold px-4 py-3 rounded text-center border border-red-100">
            Out of Stock
         </div>
         <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded shadow-sm opacity-50 cursor-not-allowed">
            ADD TO CART
         </button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6">
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-md bg-white">
          <button 
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-2 md:p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors"
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
            className="p-2 md:p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
           ({product.stock} available)
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 mt-2"
      >
        <ShoppingCart className="h-5 w-5" />
        ADD TO CART
      </button>
    </div>
  );
}
