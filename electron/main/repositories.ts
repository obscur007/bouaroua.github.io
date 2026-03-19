import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import { BackupMetadata, CreditPaymentInput, DashboardSummary, ProductInput } from '../shared/contracts';
import { databaseManager } from './database';

export class InventoryRepository {
  listProducts() {
    return databaseManager.connection
      .prepare(
        `SELECT p.id, p.name, p.sku, p.purchase_price, p.selling_price, p.stock_quantity, p.minimum_stock,
                c.name as category, s.company_name as supplier
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         LEFT JOIN suppliers s ON s.id = p.supplier_id
         ORDER BY p.name ASC`,
      )
      .all();
  }

  createProduct(input: ProductInput) {
    const stmt = databaseManager.connection.prepare(
      `INSERT INTO products (name, sku, category_id, supplier_id, purchase_price, selling_price, stock_quantity, minimum_stock)
       VALUES (@name, @sku, @categoryId, @supplierId, @purchasePrice, @sellingPrice, @stockQuantity, @minimumStock)`,
    );

    return stmt.run(input);
  }

  dashboardSummary(): DashboardSummary {
    const summary = databaseManager.connection
      .prepare(
        `SELECT
          (SELECT COUNT(*) FROM products) AS totalProducts,
          (SELECT COUNT(*) FROM products WHERE stock_quantity <= minimum_stock) AS lowStockCount,
          (SELECT COALESCE(SUM(stock_quantity * purchase_price), 0) FROM products) AS inventoryValue,
          (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE date(sale_date) = date('now', 'localtime')) AS dailySales,
          (SELECT COALESCE(SUM(total_cost), 0) FROM sales WHERE date(sale_date) = date('now', 'localtime')) AS dailyCost,
          (SELECT COALESCE(SUM(total_profit), 0) FROM sales WHERE date(sale_date) = date('now', 'localtime')) AS dailyProfit,
          (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE strftime('%Y-%m', sale_date) = strftime('%Y-%m', 'now', 'localtime')) AS monthlySales,
          (SELECT COALESCE(SUM(total_cost), 0) FROM sales WHERE strftime('%Y-%m', sale_date) = strftime('%Y-%m', 'now', 'localtime')) AS monthlyCost,
          (SELECT COALESCE(SUM(total_profit), 0) FROM sales WHERE strftime('%Y-%m', sale_date) = strftime('%Y-%m', 'now', 'localtime')) AS monthlyProfit,
          (SELECT COALESCE(SUM(remaining_amount), 0) FROM credit_sales WHERE status != 'PAID') AS unpaidCredits`,
      )
      .get() as DashboardSummary;

    return summary;
  }

  registerCreditPayment(input: CreditPaymentInput) {
    const db = databaseManager.connection;
    const transaction = db.transaction((payload: CreditPaymentInput) => {
      db.prepare(
        `INSERT INTO credit_payments (credit_sale_id, amount, paid_at, note)
         VALUES (@creditSaleId, @amount, @paidAt, @note)`,
      ).run(payload);

      const credit = db.prepare(`SELECT total_amount, paid_amount FROM credit_sales WHERE id = ?`).get(payload.creditSaleId) as {
        total_amount: number;
        paid_amount: number;
      };

      const nextPaid = credit.paid_amount + payload.amount;
      const remaining = Math.max(credit.total_amount - nextPaid, 0);
      const status = remaining === 0 ? 'PAID' : 'PARTIAL';

      db.prepare(
        `UPDATE credit_sales
         SET paid_amount = ?, remaining_amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      ).run(nextPaid, remaining, status, payload.creditSaleId);
    });

    transaction(input);
  }

  exportJsonBackup(outputDir: string) {
    const db = databaseManager.connection;
    const tables = ['categories', 'suppliers', 'customers', 'products', 'sales', 'sale_items', 'credit_sales', 'credit_payments', 'stock_movements'];
    const snapshot = Object.fromEntries(tables.map((table) => [table, db.prepare(`SELECT * FROM ${table}`).all()]));

    const metadata: BackupMetadata = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      dbPath: databaseManager.currentPath,
    };

    const target = path.join(outputDir, `backup-gestion-stock-${Date.now()}.json`);
    fs.writeFileSync(target, JSON.stringify({ metadata, snapshot }, null, 2), 'utf8');
    return target;
  }

  exportSalesReport(outputDir: string) {
    const sales = databaseManager.connection
      .prepare(
        `SELECT s.reference, s.sale_date, s.payment_method, s.total_amount, s.total_cost, s.total_profit,
                c.name AS customer_name
         FROM sales s
         LEFT JOIN customers c ON c.id = s.customer_id
         ORDER BY s.sale_date DESC`,
      )
      .all();

    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventes');

    const target = path.join(outputDir, `rapport-ventes-${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, target);
    return target;
  }
}

export const inventoryRepository = new InventoryRepository();
