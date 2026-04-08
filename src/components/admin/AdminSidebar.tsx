"use client";

import Link from "next/link";
import Image from "next/image";
import Link2 from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  Star,
  Settings,
  BarChart3,
  Bell,
  Globe,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  AlertCircle,
  FileText,
  Shield,
  CreditCard,
  Truck,
  RefreshCw,
  Eye,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
];

const catalogNav: NavItem[] = [
  { label: "Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
  { label: "Categories", href: "/admin/categories", icon: <Globe className="w-5 h-5" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
];

const customersNav: NavItem[] = [
  { label: "Customers", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
  { label: "Reviews", href: "/admin/reviews", icon: <Star className="w-5 h-5" /> },
  { label: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-5 h-5" /> },
];

const settingsNav: NavItem[] = [
  { label: "Store Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["main", "catalog", "customers"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const NavSection = ({ title, items, sectionKey }: { title: string; items: NavItem[]; sectionKey: string }) => (
    <div className="mb-2">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.includes(sectionKey) ? "rotate-180" : ""}`} />
      </button>
      {expandedSections.includes(sectionKey) && (
        <nav className="space-y-1 px-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded" />
          <span className="font-bold text-gray-900">Admin Panel</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        lg:transform-none flex flex-col
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Iyosiola Logo" width={40} height={40} className="rounded" />
            <div>
              <span className="font-bold text-lg block">Admin Panel</span>
              <span className="text-xs text-gray-400">Iyosiola Foods</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 hover:bg-gray-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-800">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/admin/products/new" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link href="/" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors">
              <Eye className="w-4 h-4" />
              <span>View Store</span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <NavSection title="Overview" items={mainNav} sectionKey="main" />
          
          <div className="px-4 py-2">
            <div className="border-t border-gray-800"></div>
          </div>
          
          <NavSection title="Catalog" items={catalogNav} sectionKey="catalog" />
          
          <div className="px-4 py-2">
            <div className="border-t border-gray-800"></div>
          </div>
          
          <NavSection title="Customers" items={customersNav} sectionKey="customers" />
          
          <div className="px-4 py-2">
            <div className="border-t border-gray-800"></div>
          </div>
          
          <NavSection title="Configuration" items={settingsNav} sectionKey="settings" />
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 p-4 space-y-3">
          {/* Notifications Preview */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Alerts</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-3 h-3" />
                <span>Low stock alert</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <ShoppingCart className="w-3 h-3" />
                <span>5 new orders</span>
              </div>
            </div>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@iyosiola.com</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
