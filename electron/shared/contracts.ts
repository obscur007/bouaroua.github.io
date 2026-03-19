export type DashboardSummary = {
  totalProducts: number;
  lowStockCount: number;
  inventoryValue: number;
  dailySales: number;
  dailyCost: number;
  dailyProfit: number;
  monthlySales: number;
  monthlyCost: number;
  monthlyProfit: number;
  unpaidCredits: number;
};

export type ProductInput = {
  name: string;
  sku: string;
  categoryId: number | null;
  supplierId: number | null;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
};

export type CreditPaymentInput = {
  creditSaleId: number;
  amount: number;
  paidAt: string;
  note?: string;
};

export type BackupMetadata = {
  exportedAt: string;
  appVersion: string;
  dbPath: string;
};
