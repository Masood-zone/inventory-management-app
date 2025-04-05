import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import type { Product } from "../types";

interface ProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isLoading: boolean;
}

export default function Products({
  products,
  setProducts,
  isLoading,
}: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async (): Promise<void> => {
    try {
      const addedProduct = await window.api.addProduct(newProduct);
      setProducts([...products, addedProduct]);
      setNewProduct({ name: "", price: 0, stock: 0, category: "" });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleEditProduct = async (): Promise<void> => {
    if (!currentProduct) return;

    try {
      const updatedProduct = await window.api.updateProduct(currentProduct);
      if (updatedProduct) {
        setProducts(
          products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setIsEditModalOpen(false);
        setCurrentProduct(null);
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (id: number): Promise<void> => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const success = await window.api.deleteProduct(id);
        if (success) {
          setProducts(products.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="input max-w-xs">
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
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
                  Category
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap">{product.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 50
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : product.stock > 10
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.stock > 50
                        ? "In Stock"
                        : product.stock > 10
                        ? "Medium"
                        : "Low Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Product</h2>
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
                handleAddProduct();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="input"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="input"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    className="input"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: Number.parseInt(e.target.value),
                      })
                    }
                    required
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
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setCurrentProduct(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditProduct();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    className="input"
                    value={currentProduct.name}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
                    className="input"
                    value={currentProduct.category}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        category: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="edit-price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    className="input"
                    min="0"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-stock"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="edit-stock"
                    className="input"
                    min="0"
                    value={currentProduct.stock}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        stock: Number.parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentProduct(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
