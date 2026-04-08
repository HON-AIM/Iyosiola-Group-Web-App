import React from "react";
import { type Metadata } from "next";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import {
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

// Constants
const LOW_STOCK_THRESHOLD = 10;
const RECENT_ORDERS_LIMIT = 5;
const LOW_STOCK_PRODUCTS_LIMIT = 5;

export const metadata: Metadata = {
  title: "Dashboard | Admin - IYOSIOLA GROUP",
  description: "Admin dashboard overview with sales, orders, and inventory metrics",
  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
  recentOrders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    user: { name: string | null; email: string | null } | null;
  }>;
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalOrders,
      totalRevenueRaw,
      totalCustomers,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ["DELIVERED", "PROCESSING", "SHIPPED"] },
        },
      }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: "asc" },
        take: LOW_STOCK_PRODUCTS_LIMIT,
      }),
      prisma.order.findMany({
        take: RECENT_ORDERS_LIMIT,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenueRaw._sum.totalAmount || 0,
      totalCustomers,
      lowStockProducts,
      recentOrders,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    // Return empty/default stats instead of crashing
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      lowStockProducts: [],
      recentOrders: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
              <TrendingUp className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 truncate">
                {formatCurrency(stats.totalRevenue)}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Delivered &amp; Processing
              </p>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalOrders.toLocaleString()}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                All statuses
              </p>
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Users className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers.toLocaleString()}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Registered users
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.lowStockProducts.length}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                &lt; {LOW_STOCK_THRESHOLD} units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1 transition-colors"
              aria-label="View all orders"
            >
              View All
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <ShoppingCart
                          className="h-8 w-8 text-gray-300"
                          aria-hidden="true"
                        />
                        <p>No orders found yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          aria-label={`View order ${order.id}`}
                        >
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.user?.name || "Guest User"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "PROCESSING"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "SHIPPED"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Low Stock Alerts
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {stats.lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm flex flex-col items-center justify-center min-h-48 space-y-2">
                <Package
                  className="h-8 w-8 text-gray-300"
                  aria-hidden="true"
                />
                <p>All products are fully stocked.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {stats.lowStockProducts.map((product) => (
                  <li
                    key={product.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-red-600 font-semibold mt-1">
                          {product.stock} unit{product.stock !== 1 ? "s" : ""} remaining
                        </p>
                      </div>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors whitespace-nowrap flex-shrink-0"
                        aria-label={`Restock ${product.name}`}
                      >
                        Restock
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {stats.lowStockProducts.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Link
                href="/admin/products"
                className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1 transition-colors"
                aria-label="View all inventory"
              >
                View Inventory
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
