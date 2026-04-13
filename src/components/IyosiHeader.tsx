"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingCart, User, Menu, ChevronDown, X, LogOut, Package, Grid3X3, Wheat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const navItems = [
  {
    label: "Our Products",
    href: "/shop",
    dropdown: [
      { label: "All Products", href: "/shop", icon: "🛒" },
      { label: "Baking Flour", href: "/shop?category=BAKING", icon: "🌾" },
      { label: "Wheat Flour", href: "/shop?category=WHEAT", icon: "🌿" },
      { label: "All-Purpose Flour", href: "/shop?category=ALL_PURPOSE", icon: "🍞" },
      { label: "Semolina", href: "/shop?category=SEMOLINA", icon: "✨" },
      { label: "Bundle Deals", href: "/shop?category=bundle", icon: "📦" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface IyosiHeaderProps {
  showAnnouncement?: boolean;
  announcementText?: string;
}

export default function IyosiHeader({ showAnnouncement = true, announcementText }: IyosiHeaderProps) {
  const { data: session } = useSession();
  const { cartItemsCount, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerAnnouncement, setHeaderAnnouncement] = useState<string>("");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openDelayRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch announcement from store settings
  useEffect(() => {
    if (!showAnnouncement) return;
    
    if (announcementText) {
      setHeaderAnnouncement(announcementText);
      return;
    }

    const controller = new AbortController();
    fetch("/api/admin/settings", { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data.settings?.announcementText) {
          setHeaderAnnouncement(data.settings.announcementText);
        }
      })
      .catch(() => {});
    
    return () => controller.abort();
  }, [showAnnouncement, announcementText]);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  // Dropdown with open delay to prevent accidental triggers
  const handleDropdownEnter = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (openDelayRef.current) clearTimeout(openDelayRef.current);
    openDelayRef.current = setTimeout(() => {
      setActiveDropdown(label);
    }, 120);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    if (openDelayRef.current) clearTimeout(openDelayRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  }, []);

  const handleAccountEnter = useCallback(() => {
    if (accountDropdownTimeoutRef.current) clearTimeout(accountDropdownTimeoutRef.current);
    setAccountDropdownOpen(true);
  }, []);

  const handleAccountLeave = useCallback(() => {
    accountDropdownTimeoutRef.current = setTimeout(() => {
      setAccountDropdownOpen(false);
    }, 250);
  }, []);

  // Keyboard navigation for dropdowns
  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent, label: string, hasDropdown: boolean) => {
    if (!hasDropdown) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveDropdown(activeDropdown === label ? null : label);
    }
    if (e.key === "Escape") {
      setActiveDropdown(null);
    }
  }, [activeDropdown]);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (accountDropdownTimeoutRef.current) clearTimeout(accountDropdownTimeoutRef.current);
      if (openDelayRef.current) clearTimeout(openDelayRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      {/* Announcement Banner */}
      {headerAnnouncement && (
        <div className="bg-primary-900 text-white text-xs py-1.5 text-center font-medium px-4">
          {headerAnnouncement}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.jpg" alt="Iyosi Foods Logo" width={45} height={45} className="object-contain" />
            <div className="hidden sm:block">
              <span className="font-extrabold text-xl text-primary-900 tracking-tight block leading-tight">IYOSI FOODS</span>
              <span className="text-[10px] text-surface-500 font-medium tracking-wider uppercase">Quality You Can Taste</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleDropdownEnter(item.label)}
                onMouseLeave={() => item.dropdown && handleDropdownLeave()}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-surface-700 font-medium hover:text-primary-600 transition-colors rounded-lg hover:bg-surface-50 ${
                    activeDropdown === item.label ? "text-primary-600 bg-surface-50" : ""
                  }`}
                  onKeyDown={(e) => handleDropdownKeyDown(e, item.label, !!item.dropdown)}
                  aria-haspopup={item.dropdown ? "true" : undefined}
                  aria-expanded={item.dropdown ? (activeDropdown === item.label).toString() as "true" | "false" : undefined}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 w-64 bg-white border border-surface-200 shadow-2xl rounded-xl overflow-hidden mt-1"
                      role="menu"
                    >
                      {/* Accent top bar */}
                      <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                      <div className="py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 transition-colors"
                            role="menuitem"
                          >
                            <span className="text-lg w-6 text-center">{subItem.icon}</span>
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden xl:flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 2xl:w-64 pl-4 pr-10 py-2.5 rounded-xl border border-surface-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all bg-surface-50 focus:bg-white"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Account Dropdown */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={handleAccountEnter}
              onMouseLeave={handleAccountLeave}
            >
              <button className="flex items-center gap-2 p-2.5 hover:bg-surface-50 rounded-lg transition-colors">
                <User className="h-5 w-5 text-surface-600" />
                <span className="hidden lg:block text-sm font-medium text-surface-700 max-w-[80px] truncate">
                  {session ? session.user.name?.split(" ")[0] : "Account"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
              </button>

              <AnimatePresence>
                {accountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full right-0 w-60 bg-white border border-surface-200 shadow-2xl rounded-xl overflow-hidden mt-1"
                  >
                    <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                    {session ? (
                      <>
                        <div className="py-3 px-4 border-b border-surface-100 bg-surface-50">
                          <p className="text-sm font-semibold text-surface-900 truncate">{session.user.name}</p>
                          <p className="text-xs text-surface-500 truncate">{session.user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 transition-colors">
                            <User className="w-4 h-4" />My Account
                          </Link>
                          <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 transition-colors">
                            <Package className="w-4 h-4" />Orders
                          </Link>
                          <Link href="/dashboard/inbox" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 transition-colors">
                            <span className="w-4 h-4 flex items-center justify-center text-xs">💬</span>Inbox
                          </Link>
                        </div>
                        <div className="border-t border-surface-100 py-1">
                          <button
                            onClick={() => signOut({ callbackUrl: "/shop" })}
                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 border-b border-surface-100">
                          <Link
                            href="/login"
                            className="block w-full text-center bg-primary-600 text-white font-bold py-2.5 rounded-lg shadow-md hover:bg-primary-700 transition-colors"
                          >
                            SIGN IN
                          </Link>
                          <div className="mt-3 text-center text-sm">
                            <span className="text-surface-600">New customer? </span>
                            <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                              Create Account
                            </Link>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 transition-colors">
                            <User className="w-4 h-4" />My Account
                          </Link>
                          <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-600 transition-colors">
                            <ShoppingCart className="w-4 h-4" />Orders
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-surface-50 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-surface-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-surface-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-surface-700" /> : <Menu className="h-5 w-5 text-surface-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden border-t border-surface-200 overflow-hidden bg-white relative z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-l-lg border border-surface-200 focus:outline-none focus:border-primary-500 text-sm"
                  />
                  <button type="submit" className="bg-primary-600 text-white px-4 rounded-r-lg hover:bg-primary-700 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                {/* Nav Items with collapsible sub-menus */}
                {navItems.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => !item.dropdown && setMobileMenuOpen(false)}
                        className="flex-1 flex items-center px-4 py-3 font-medium text-surface-800 hover:bg-surface-50 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                      {item.dropdown && (
                        <button
                          onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.label ? null : item.label)}
                          className="p-3 hover:bg-surface-50 rounded-lg transition-colors"
                          aria-label={`Expand ${item.label} submenu`}
                        >
                          <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform duration-200 ${mobileSubmenuOpen === item.label ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {/* Collapsible sub-menu */}
                    <AnimatePresence>
                      {item.dropdown && mobileSubmenuOpen === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 space-y-0.5 pb-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-primary-600 rounded-lg transition-colors"
                              >
                                <span className="text-base">{subItem.icon}</span>
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Auth Section */}
                <div className="border-t border-surface-200 pt-4 mt-4">
                  {session ? (
                    <div className="space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-medium text-surface-800 hover:bg-surface-50 rounded-lg"
                      >
                        <User className="w-5 h-5" />
                        My Account
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-medium text-surface-800 hover:bg-surface-50 rounded-lg"
                      >
                        <Package className="w-5 h-5" />
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-3 font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-3 px-4 text-center font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-3 px-4 text-center font-bold bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
