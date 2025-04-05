export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Sale {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
  customer: string;
}

export interface Settings {
  companyName: string;
  email: string;
  currency: string;
  darkMode: boolean;
  notifications: boolean;
  backupEnabled: boolean;
  backupFrequency: string;
  backupLocation: string;
}

// Add this to make TypeScript recognize the window.api object
declare global {
  interface Window {
    api: {
      getProducts: () => Promise<Product[]>;
      addProduct: (product: Omit<Product, "id">) => Promise<Product>;
      updateProduct: (product: Product) => Promise<Product | null>;
      deleteProduct: (id: number) => Promise<boolean>;

      getSales: () => Promise<Sale[]>;
      addSale: (sale: Omit<Sale, "id">) => Promise<Sale>;

      getSettings: () => Promise<Settings>;
      saveSettings: (settings: Settings) => Promise<Settings>;

      backupData: (
        location: string
      ) => Promise<{ success: boolean; message: string }>;
      restoreData: (
        location: string
      ) => Promise<{ success: boolean; message: string }>;
    };
  }
}
