import Header from "@/components/shop/Header";
import CartSidebar from "@/components/shop/CartSidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Unified Jumia-style Top Header */}
      <Header />
      
      {/* Sliding Cart */}
      <CartSidebar />

      {/* Main Pages Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      {/* Shop Specific Footer */}
      <footer className="w-full bg-slate-900 text-slate-300 py-12 px-4 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <h4 className="text-white font-bold uppercase mb-4 tracking-wider">Let Us Help You</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-white transition">Help Center</a></li>
               <li><a href="#" className="hover:text-white transition">How to shop</a></li>
               <li><a href="#" className="hover:text-white transition">Delivery options</a></li>
               <li><a href="#" className="hover:text-white transition">Return Policy</a></li>
             </ul>
          </div>
          <div>
             <h4 className="text-white font-bold uppercase mb-4 tracking-wider">About Iyosiola Store</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-white transition">About Us</a></li>
               <li><a href="#" className="hover:text-white transition">Terms and Conditions</a></li>
               <li><a href="#" className="hover:text-white transition">Privacy Notice</a></li>
             </ul>
          </div>
          <div>
             <h4 className="text-white font-bold uppercase mb-4 tracking-wider">Make Money With Us</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-white transition">Sell on Iyosiola</a></li>
               <li><a href="#" className="hover:text-white transition">Become an Affiliate</a></li>
             </ul>
          </div>
          <div>
             <h4 className="text-white font-bold uppercase mb-4 tracking-wider">Iyosiola International</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-white transition">Iyosiola Group Home</a></li>
               <li><a href="#" className="hover:text-white transition">Flour Milling Division</a></li>
             </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
