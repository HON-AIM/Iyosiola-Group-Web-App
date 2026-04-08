import React from "react";
import { type Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  ArrowUpRight,
  Calendar,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics | Admin - IYOSIOLA GROUP",
  description: "Store analytics and reports",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  const reportCards = [
    {
      title: "Sales Report",
      description: "View detailed sales data by date range",
      icon: <DollarSign className="w-6 h-6" />,
      color: "green",
      href: "/admin/analytics/sales",
    },
    {
      title: "Orders Report",
      description: "Order volume and fulfillment metrics",
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "blue",
      href: "/admin/analytics/orders",
    },
    {
      title: "Customer Report",
      description: "Customer acquisition and retention",
      icon: <Users className="w-6 h-6" />,
      color: "purple",
      href: "/admin/analytics/customers",
    },
    {
      title: "Products Report",
      description: "Product performance and inventory",
      icon: <Package className="w-6 h-6" />,
      color: "orange",
      href: "/admin/analytics/products",
    },
  ];

  const metrics = [
    { label: "Total Sales", value: "₦0", change: "+0%", positive: true },
    { label: "Total Orders", value: "0", change: "+0%", positive: true },
    { label: "Avg. Order Value", value: "₦0", change: "+0%", positive: true },
    { label: "Conversion Rate", value: "0%", change: "+0%", positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">Track your store performance and generate reports</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 rounded-lg hover:bg-green-700 text-white font-medium text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{metric.label}</span>
              {metric.positive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className={`text-sm font-medium mt-1 ${metric.positive ? "text-green-600" : "text-red-600"}`}>
              {metric.change} from last period
            </p>
          </div>
        ))}
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Reports</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {reportCards.map((report, i) => (
            <Link
              key={i}
              href={report.href}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-${report.color}-50 text-${report.color}-600 group-hover:scale-110 transition-transform`}>
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {report.title}
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </h3>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming Soon - Charts Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sales Trend</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 font-medium">Sales chart will appear here</p>
            <p className="text-sm text-gray-400">Connect your analytics data to see trends</p>
          </div>
        </div>
      </div>
    </div>
  );
}
