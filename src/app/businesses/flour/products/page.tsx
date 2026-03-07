import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Premium Baking Flour", price: 15000, category: "Baking", desc: "The standard for commercial bakeries. High gluten content for the perfect rise every time." },
    { id: 2, name: "All-Purpose Flour", price: 12500, category: "All-Purpose", desc: "Versatile and reliable for all your daily baking and cooking needs." },
    { id: 3, name: "Whole Wheat Flour", price: 18000, category: "Wheat", desc: "100% organic whole wheat, rich in fiber and essential nutrients." },
    { id: 4, name: "Semolina Extra", price: 16500, category: "Semolina", desc: "Finely milled durum wheat, perfect for traditional dishes and pasta." },
    { id: 5, name: "Pastry Premium Blend", price: 19000, category: "Baking", desc: "Extra fine mill designed specifically for delicate pastries and cakes." },
    { id: 6, name: "Biscuit Flour", price: 14000, category: "Baking", desc: "Optimized protein content for the perfect biscuit snap and texture." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <section className="bg-primary-900 text-white py-16 px-4 md:px-8 text-center border-b-4 border-accent-500">
         <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Products</h1>
         <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light">
           Browse our catalog of premium milled products. Quality guaranteed in every bag.
         </p>
      </section>

      <section className="container mx-auto px-4 py-12 flex gap-8">
         {/* Sidebar / Filters (Desktop) */}
         <aside className="hidden md:block w-64 flex-shrink-0">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 sticky top-28">
                 <h3 className="font-bold text-lg text-primary-900 mb-4 border-b border-surface-100 pb-2">Categories</h3>
                 <ul className="space-y-3 text-surface-600 font-medium">
                     <li><button className="text-accent-600 font-bold w-full text-left flex justify-between">All Products <span>(6)</span></button></li>
                     <li><button className="hover:text-primary-600 w-full text-left transition-colors flex justify-between">Baking <span>(3)</span></button></li>
                     <li><button className="hover:text-primary-600 w-full text-left transition-colors flex justify-between">All-Purpose <span>(1)</span></button></li>
                     <li><button className="hover:text-primary-600 w-full text-left transition-colors flex justify-between">Wheat <span>(1)</span></button></li>
                     <li><button className="hover:text-primary-600 w-full text-left transition-colors flex justify-between">Semolina <span>(1)</span></button></li>
                 </ul>
             </div>
         </aside>

         {/* Product Grid */}
         <main className="flex-grow">
             <div className="flex justify-between items-center mb-6">
                 <p className="text-surface-500 font-semibold">Showing {products.length} products</p>
                 <select className="bg-white border border-surface-300 text-surface-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium">
                     <option>Sort by: Featured</option>
                     <option>Price: Low to High</option>
                     <option>Price: High to Low</option>
                 </select>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden interactive-hover flex flex-col h-full">
                       <div className="h-48 bg-surface-100 w-full relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                              {/* Placeholder for actual product image */}
                              <svg className="w-16 h-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                          </div>
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-accent-700 shadow-sm uppercase tracking-wide">
                             {product.category}
                          </div>
                       </div>
                       <div className="p-5 flex flex-col flex-grow">
                           <h3 className="text-xl font-bold text-primary-900 mb-2">{product.name}</h3>
                           <p className="text-surface-600 text-sm mb-4 line-clamp-3 flex-grow">{product.desc}</p>
                           <div className="flex justify-between items-center mt-auto pt-4 border-t border-surface-100">
                               <span className="text-xl font-extrabold text-primary-700">₦{product.price.toLocaleString()}</span>
                               <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors shadow-sm text-sm">
                                  Add to Cart
                               </button>
                           </div>
                       </div>
                    </div>
                ))}
             </div>
         </main>
      </section>
    </div>
  );
}
