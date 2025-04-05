// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Product, Sale, Settings } from "./types";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // Product operations
  getProducts: () => ipcRenderer.invoke("get-products"),
  addProduct: (product: Product) => ipcRenderer.invoke("add-product", product),
  updateProduct: (product: Product) =>
    ipcRenderer.invoke("update-product", product),
  deleteProduct: (id: number) => ipcRenderer.invoke("delete-product", id),

  // Sales operations
  getSales: () => ipcRenderer.invoke("get-sales"),
  addSale: (sale: Sale) => ipcRenderer.invoke("add-sale", sale),

  // Settings operations
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: Settings) =>
    ipcRenderer.invoke("save-settings", settings),

  // Backup operations
  backupData: (location: string) => ipcRenderer.invoke("backup-data", location),
  restoreData: (location: string) =>
    ipcRenderer.invoke("restore-data", location),
});
