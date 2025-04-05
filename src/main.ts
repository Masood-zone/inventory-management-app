import { app, BrowserWindow, ipcMain, Notification } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    stock: 100,
    category: "Electronics",
  },
  { id: 2, name: "Product 2", price: 29.99, stock: 50, category: "Clothing" },
  { id: 3, name: "Product 3", price: 39.99, stock: 75, category: "Food" },
];

const mockSales = [
  {
    id: 1,
    productId: 1,
    quantity: 3,
    total: 59.97,
    date: "2023-04-01",
    customer: "John Doe",
  },
  {
    id: 2,
    productId: 2,
    quantity: 1,
    total: 29.99,
    date: "2023-04-02",
    customer: "Jane Smith",
  },
  {
    id: 3,
    productId: 3,
    quantity: 2,
    total: 79.98,
    date: "2023-04-03",
    customer: "Bob Johnson",
  },
];

let settings = {
  companyName: "My Company",
  email: "admin@example.com",
  currency: "USD",
  darkMode: false,
  notifications: true,
  backupEnabled: false,
  backupFrequency: "weekly",
  backupLocation: "",
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools - Test
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const NOTIFICATION_TITLE = "Basic Notification";
const NOTIFICATION_BODY = "Notification from the Main process";

function showNotification() {
  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show();
}

app.on("ready", () => {
  // Set up IPC handlers
  // Products
  ipcMain.handle("get-products", () => {
    return mockProducts;
  });

  ipcMain.handle("add-product", (_, product) => {
    const newProduct = { ...product, id: mockProducts.length + 1 };
    mockProducts.push(newProduct);
    return newProduct;
  });

  ipcMain.handle("update-product", (_, product) => {
    const index = mockProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      mockProducts[index] = product;
      return product;
    }
    return null;
  });

  ipcMain.handle("delete-product", (_, id) => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      return true;
    }
    return false;
  });

  // Sales
  ipcMain.handle("get-sales", () => {
    return mockSales;
  });

  ipcMain.handle("add-sale", (_, sale) => {
    const newSale = { ...sale, id: mockSales.length + 1 };
    mockSales.push(newSale);

    // Update product stock
    const product = mockProducts.find((p) => p.id === sale.productId);
    if (product) {
      product.stock -= sale.quantity;
    }

    return newSale;
  });

  // Settings
  ipcMain.handle("get-settings", () => {
    return settings;
  });

  ipcMain.handle("save-settings", (_, newSettings) => {
    settings = newSettings;
    return settings;
  });

  // Backup (placeholder implementations)
  ipcMain.handle("backup-data", (_, location) => {
    console.log(`Backing up data to ${location}`);
    return { success: true, message: "Backup completed successfully" };
  });

  ipcMain.handle("restore-data", (_, location) => {
    console.log(`Restoring data from ${location}`);
    return { success: true, message: "Restore completed successfully" };
  });

  createWindow();
  showNotification();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
