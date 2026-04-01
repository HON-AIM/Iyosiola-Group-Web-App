"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
