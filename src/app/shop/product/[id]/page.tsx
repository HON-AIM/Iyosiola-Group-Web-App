import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductActions from "@/components/shop/ProductActions";
import { ShieldCheck, Truck, RotateCcw, Package } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 flex gap-2 items-center">
         <Link href="/shop" className="hover:text-primary-600">Home</Link>
         <span>&gt;</span>
          <span className="capitalize hover:text-primary-600 cursor-pointer">{product.category || 'Products'}</span>
         <span>&gt;</span>
         <span className="text-gray-800 line-clamp-1">{product.name}</span>
      </nav>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 lg:w-4/12 p-4 md:p-8 flex flex-col">
          <div className="relative aspect-square w-full bg-white rounded-md flex justify-center items-center">
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                className="object-contain hover:scale-105 transition-transform duration-500 p-4"
                priority
              />
            ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-full flex flex-col items-center justify-center text-gray-400">
                    <Package className="h-12 w-12 mb-2" />
                    No Image
                </div>
            )}
          </div>
        </div>

        {/* Center: Product Details & Actions */}
        <div className="w-full md:w-1/2 lg:w-5/12 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col">
           <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-medium text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-sm mb-4">
                 <span className="text-gray-500">Brand: <span className="text-blue-600 hover:underline cursor-pointer">Iyosiola</span></span>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-500">Similar products from Iyosiola</span>
              </div>

              {/* Price Block */}
              <div className="border-t border-b border-gray-100 py-4 mb-4 bg-gray-50/50 -mx-6 px-6 md:mx-0 md:px-0 md:bg-transparent">
                 <div className="flex items-baseline gap-3 relative">
                    <h2 className="text-3xl font-extrabold text-gray-900">{formatMoney(product.price)}</h2>
                    <span className="text-gray-400 line-through text-lg">{formatMoney(product.price * 1.15)}</span>
                    <span className="bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded text-xs ml-2">
                       -15%
                    </span>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">+ shipping from ₦1,500 to specific zones</p>
              </div>

              {/* Description Snippet */}
              <div className="prose prose-sm text-gray-700 font-medium">
                  {product.description}
              </div>
           </div>

           {/* Client Component: Add to Cart */}
           <ProductActions 
             product={{
               id: product.id,
               name: product.name,
               price: product.price,
               stock: product.stock,
               image: product.image
             }} 
           />
        </div>

        {/* Right: Delivery & Returns Sidebar (Jumia Style) */}
        <div className="hidden lg:block w-3/12 border-l border-gray-100 bg-gray-50 p-6">
           <h3 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wide">Delivery & Returns</h3>
           
           <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="mt-1">
                    <div className="border border-gray-200 p-1.5 rounded bg-white">
                      <Truck className="h-5 w-5 text-gray-600" />
                    </div>
                 </div>
                 <div>
                    <h4 className="font-medium text-gray-900 text-sm">Door Delivery</h4>
                    <p className="text-xs text-gray-600 mt-1">Delivery expected between 2 - 5 business days after ordering.</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="mt-1">
                    <div className="border border-gray-200 p-1.5 rounded bg-white">
                      <RotateCcw className="h-5 w-5 text-gray-600" />
                    </div>
                 </div>
                 <div>
                    <h4 className="font-medium text-gray-900 text-sm">Return Policy</h4>
                    <p className="text-xs text-gray-600 mt-1">Free return within 7 days for eligible items.</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="mt-1">
                    <div className="border border-gray-200 p-1.5 rounded bg-white">
                      <ShieldCheck className="h-5 w-5 text-gray-600" />
                    </div>
                 </div>
                 <div>
                    <h4 className="font-medium text-gray-900 text-sm">Authenticity Promise</h4>
                    <p className="text-xs text-gray-600 mt-1">100% Genuine, directly manufactured by Iyosiola Mills.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
