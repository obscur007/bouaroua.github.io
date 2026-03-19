/// <reference types="vite/client" />

import type { CreditPaymentInput, DashboardSummary, ProductInput } from '../electron/shared/contracts';

declare global {
  interface Window {
    stockApp?: {
      chooseDatabaseFolder: () => Promise<string | null>;
      getDashboardSummary: () => Promise<DashboardSummary>;
      listProducts: () => Promise<unknown[]>;
      createProduct: (payload: ProductInput) => Promise<unknown>;
      registerCreditPayment: (payload: CreditPaymentInput) => Promise<void>;
      exportJsonBackup: () => Promise<string | null>;
      exportSalesReport: () => Promise<string | null>;
      importBackup: () => Promise<string | null>;
    };
  }
}

export {};
