import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | IYOSIOLA GROUP",
  description: "Manage products, orders, customers, and store settings",
  robots: {
    index: false,
    follow: false,
  },
};

interface SessionUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

interface AuthSession {
  user?: SessionUser;
  expires?: string;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session: AuthSession | null = null;

  try {
    session = await auth();
  } catch (error) {
    console.error("Auth session error:", error);
    redirect("/login");
  }

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-0 pl-0">
        {/* Top Bar for Mobile */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <div className="text-sm text-gray-500">Admin Dashboard</div>
        </header>

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 lg:p-8"
          role="main"
          aria-label="Admin dashboard content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
