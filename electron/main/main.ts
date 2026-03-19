import fs from 'node:fs';
import path from 'node:path';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import log from 'electron-log';
import { databaseManager } from './database';
import { inventoryRepository } from './repositories';

const isDev = !app.isPackaged;
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1560,
    height: 980,
    minWidth: 1280,
    minHeight: 800,
    title: 'Gestion Stock Pro',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch((error) => log.error(error));
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html')).catch((error) => log.error(error));
  }
}

async function chooseDbFolder() {
  const result = await dialog.showOpenDialog({
    title: 'Choisir le dossier de la base de données',
    properties: ['openDirectory', 'createDirectory'],
  });

  if (result.canceled || !result.filePaths[0]) {
    return databaseManager.currentPath || databaseManager.initialize();
  }

  return databaseManager.initialize(result.filePaths[0]);
}

app.whenReady().then(async () => {
  await chooseDbFolder();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    databaseManager.close();
    app.quit();
  }
});

ipcMain.handle('system:choose-db-folder', async () => chooseDbFolder());
ipcMain.handle('dashboard:get-summary', () => inventoryRepository.dashboardSummary());
ipcMain.handle('products:list', () => inventoryRepository.listProducts());
ipcMain.handle('products:create', (_, payload) => inventoryRepository.createProduct(payload));
ipcMain.handle('credits:register-payment', (_, payload) => inventoryRepository.registerCreditPayment(payload));
ipcMain.handle('backup:export-json', async () => {
  const result = await dialog.showOpenDialog({ title: 'Choisir le dossier de sauvegarde JSON', properties: ['openDirectory', 'createDirectory'] });
  if (result.canceled || !result.filePaths[0]) return null;
  return inventoryRepository.exportJsonBackup(result.filePaths[0]);
});
ipcMain.handle('backup:export-sales-report', async () => {
  const result = await dialog.showOpenDialog({ title: 'Choisir le dossier du rapport Excel', properties: ['openDirectory', 'createDirectory'] });
  if (result.canceled || !result.filePaths[0]) return null;
  return inventoryRepository.exportSalesReport(result.filePaths[0]);
});
ipcMain.handle('backup:import-json', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Importer une sauvegarde JSON',
    filters: [{ name: 'Sauvegarde JSON', extensions: ['json'] }],
    properties: ['openFile'],
  });

  if (result.canceled || !result.filePaths[0]) return null;

  const content = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8')) as { snapshot: Record<string, unknown[]> };
  const db = databaseManager.connection;

  const transaction = db.transaction(() => {
    const deleteOrder = ['credit_payments', 'credit_sales', 'sale_items', 'sales', 'stock_movements', 'products', 'customers', 'suppliers', 'categories'];
    deleteOrder.forEach((table) => db.prepare(`DELETE FROM ${table}`).run());

    Object.entries(content.snapshot).forEach(([table, rows]) => {
      rows.forEach((row) => {
        const columns = Object.keys(row);
        const placeholders = columns.map((column) => `@${column}`).join(', ');
        db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`).run(row);
      });
    });
  });

  transaction();
  return result.filePaths[0];
});
