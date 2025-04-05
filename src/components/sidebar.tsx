import React from "react";
import { Home, Package, BarChart2, Settings } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "products", label: "Products", icon: Package },
    { id: "sales", label: "Sales", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Inventory Manager
        </h1>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  currentPage === item.id
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
