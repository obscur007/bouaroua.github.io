import { contextBridge, ipcRenderer } from 'electron';
import type { CreditPaymentInput, ProductInput } from '../shared/contracts';

contextBridge.exposeInMainWorld('stockApp', {
  chooseDatabaseFolder: () => ipcRenderer.invoke('system:choose-db-folder'),
  getDashboardSummary: () => ipcRenderer.invoke('dashboard:get-summary'),
  listProducts: () => ipcRenderer.invoke('products:list'),
  createProduct: (payload: ProductInput) => ipcRenderer.invoke('products:create', payload),
  registerCreditPayment: (payload: CreditPaymentInput) => ipcRenderer.invoke('credits:register-payment', payload),
  exportJsonBackup: () => ipcRenderer.invoke('backup:export-json'),
  exportSalesReport: () => ipcRenderer.invoke('backup:export-sales-report'),
  importBackup: () => ipcRenderer.invoke('backup:import-json'),
});
