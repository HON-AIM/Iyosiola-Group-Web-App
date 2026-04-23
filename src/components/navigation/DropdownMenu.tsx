"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavChild } from "@/config/navConfig";

interface DropdownMenuProps {
  items: NavChild[];
  id: string;
  onItemClick?: () => void;
}

export default function DropdownMenu({ items, id, onItemClick }: DropdownMenuProps) {
  const pathname = usePathname();

  return (
    <div
      id={id}
      role="menu"
      className="dropdown-panel"
    >
      {/* Accent top bar */}
      <div className="h-[3px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

      <div className="py-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={onItemClick}
              className={`group flex flex-col gap-0.5 px-5 py-3 transition-colors duration-150 ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-surface-700 hover:bg-surface-50 hover:text-primary-600"
              }`}
            >
              <span className="text-sm font-medium">{item.label}</span>
              {item.description && (
                <span className={`text-xs transition-colors duration-150 ${
                  isActive ? "text-primary-500" : "text-surface-400 group-hover:text-surface-500"
                }`}>
                  {item.description}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
