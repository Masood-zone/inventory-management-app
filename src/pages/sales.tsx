import React, { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Plus, X, Printer, Eye } from "lucide-react";
import type { Product, Sale, Settings as SettingsType } from "../types";
import { printReceipt, previewReceipt } from "../utils/printUtil";
import Receipt from "../components/receipt";

interface SalesProps {
  products: Product[];
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  isLoading: boolean;
  settings?: SettingsType | null;
}

export default function Sales({
  products,
  sales,
  setSales,
  isLoading,
  settings,
}: SalesProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [newSale, setNewSale] = useState({
    productId: 0,
    quantity: 1,
    total: 0,
    date: new Date().toISOString().split("T")[0],
    customer: "",
  });

  // Group sales by month for the chart
  const salesByMonth = sales.reduce((acc, sale) => {
    const month = sale.date.substring(0, 7); // Format: YYYY-MM
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += sale.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByMonth)
    .map(([month, total]) => {
      const [year, monthNum] = month.split("-");
      const date = new Date(
        Number.parseInt(year),
        Number.parseInt(monthNum) - 1
      );
      return {
        name: date.toLocaleString("default", { month: "short" }),
        sales: total,
      };
    })
    .sort((a, b) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(a.name) - months.indexOf(b.name);
    });

  const handleProductChange = (productId: number): void => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const total = product.price * newSale.quantity;
      setNewSale({
        ...newSale,
        productId,
        total,
      });
    }
  };

  const handleQuantityChange = (quantity: number): void => {
    const product = products.find((p) => p.id === newSale.productId);
    if (product) {
      const total = product.price * quantity;
      setNewSale({
        ...newSale,
        quantity,
        total,
      });
    }
  };

  const handleAddSale = async (): Promise<void> => {
    try {
      const addedSale = await window.api.addSale(newSale);
      setSales([...sales, addedSale]);

      // Show receipt after adding sale
      setSelectedSale(addedSale);
      setIsReceiptModalOpen(true);

      setNewSale({
        productId: 0,
        quantity: 1,
        total: 0,
        date: new Date().toISOString().split("T")[0],
        customer: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add sale:", error);
    }
  };

  const handlePrintReceipt = (sale: Sale): void => {
    const product = products.find((p) => p.id === sale.productId);
    if (!product) {
      alert("Product not found");
      return;
    }

    printReceipt({
      sale,
      product,
      companyName: settings?.companyName || "Your Company",
      companyEmail: settings?.email || "info@yourcompany.com",
      currency: settings?.currency || "USD",
    });
  };

  const handlePreviewReceipt = (sale: Sale): void => {
    const product = products.find((p) => p.id === sale.productId);
    if (!product) {
      alert("Product not found");
      return;
    }

    previewReceipt({
      sale,
      product,
      companyName: settings?.companyName || "Your Company",
      companyEmail: settings?.email || "info@yourcompany.com",
      currency: settings?.currency || "USD",
    });
  };

  const handlePrintCurrentReceipt = (): void => {
    if (!selectedSale) return;

    const product = products.find((p) => p.id === selectedSale.productId);
    if (!product) {
      alert("Product not found");
      return;
    }

    printReceipt({
      sale: selectedSale,
      product,
      companyName: settings?.companyName || "Your Company",
      companyEmail: settings?.email || "info@yourcompany.com",
      currency: settings?.currency || "USD",
    });

    setIsReceiptModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading sales data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </button>
      </div>

      {/* Sales Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Sales History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sales.map((sale) => {
                const product = products.find((p) => p.id === sale.productId);
                return (
                  <tr key={sale.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{sale.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product ? product.name : `Product ${sale.productId}`}
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => handlePreviewReceipt(sale)}
                          title="Preview Receipt"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          onClick={() => handlePrintReceipt(sale)}
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Sale</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSale();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="product"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Product
                  </label>
                  <select
                    id="product"
                    className="input"
                    value={newSale.productId}
                    onChange={(e) =>
                      handleProductChange(Number.parseInt(e.target.value))
                    }
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="customer"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Customer
                  </label>
                  <input
                    type="text"
                    id="customer"
                    className="input"
                    value={newSale.customer}
                    onChange={(e) =>
                      setNewSale({ ...newSale, customer: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="input"
                    value={newSale.date}
                    onChange={(e) =>
                      setNewSale({ ...newSale, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="input"
                    min="1"
                    value={newSale.quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number.parseInt(e.target.value))
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="total"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Total
                  </label>
                  <input
                    type="number"
                    id="total"
                    className="input"
                    value={newSale.total}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sale Receipt</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setIsReceiptModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {selectedSale && (
                <Receipt
                  ref={receiptRef}
                  sale={selectedSale}
                  product={
                    products.find((p) => p.id === selectedSale.productId) || {
                      id: 0,
                      name: "Unknown Product",
                      price: 0,
                      stock: 0,
                      category: "",
                    }
                  }
                  companyName={settings?.companyName || "Your Company"}
                  companyEmail={settings?.email || "info@yourcompany.com"}
                  currency={settings?.currency || "USD"}
                />
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2"
                onClick={() => setIsReceiptModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary flex items-center"
                onClick={handlePrintCurrentReceipt}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
