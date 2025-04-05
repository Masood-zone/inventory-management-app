import React, { useState } from "react";
import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { useTheme } from "../components/theme-provider";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleTheme}
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
