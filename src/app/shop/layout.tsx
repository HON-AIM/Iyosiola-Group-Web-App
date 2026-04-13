import IyosiHeader from "@/components/IyosiHeader";
import CartSidebar from "@/components/shop/CartSidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <IyosiHeader />
      <CartSidebar />

      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
