import React from "react";
import {
  ArrowUp,
  ArrowDown,
  Package,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import type { Product, Sale } from "../types";

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  isLoading: boolean;
}

export default function Dashboard({
  products,
  sales,
  isLoading,
}: DashboardProps) {
  // Calculate dashboard metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  // Low stock products
  const lowStockProducts = products.filter((product) => product.stock < 20);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      change: "+5%",
      isUp: true,
      color: "bg-blue-500",
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: ShoppingCart,
      change: "+12%",
      isUp: true,
      color: "bg-green-500",
    },
    {
      title: "Inventory Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      change: "-3%",
      isUp: false,
      color: "bg-purple-500",
    },
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      change: "+8%",
      isUp: true,
      color: "bg-yellow-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.isUp ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.isUp ? "text-green-500" : "text-red-500"}>
                {stat.change}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Low Stock Items</h2>
        {lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No low stock items found.
          </p>
        )}
      </div>

      {/* Recent Sales */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
        {sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{sale.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sale.productId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sale.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{sale.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      ${sale.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No sales found.</p>
        )}
      </div>
    </div>
  );
}
