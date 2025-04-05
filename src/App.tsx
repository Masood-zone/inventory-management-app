import React, { useState, useEffect, JSX } from "react";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./pages/dashboard";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Settings from "./pages/settings";
import type { Product, Sale, Settings as SettingsType } from "./types";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from the main process
    const loadData = async (): Promise<void> => {
      try {
        const [productsData, salesData, settingsData] = await Promise.all([
          window.api.getProducts(),
          window.api.getSales(),
          window.api.getSettings(),
        ]);

        setProducts(productsData);
        setSales(salesData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const renderPage = (): JSX.Element => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard products={products} sales={sales} isLoading={isLoading} />
        );
      case "products":
        return (
          <Products
            products={products}
            setProducts={setProducts}
            isLoading={isLoading}
          />
        );
      case "sales":
        return (
          <Sales
            products={products}
            sales={sales}
            setSales={setSales}
            isLoading={isLoading}
            settings={settings}
          />
        );
      case "settings":
        return (
          <Settings
            settings={settings}
            setSettings={setSettings}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <Dashboard products={products} sales={sales} isLoading={isLoading} />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">{renderPage()}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
