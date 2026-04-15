import Navbar from "@/components/navigation/Navbar";
import CartSidebar from "@/components/shop/CartSidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar />
      <CartSidebar />

      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
