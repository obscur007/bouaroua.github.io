import { Bell, Search } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col xl:flex-row">
        <Sidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-brand-600">Mode bureau · Offline first</p>
                <h1 className="text-2xl font-semibold text-slate-950">Gestion commerciale en français</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <Search className="h-4 w-4" />
                  <input
                    className="w-full border-none bg-transparent outline-none placeholder:text-slate-400"
                    placeholder="Recherche globale: produit, SKU, client, catégorie..."
                  />
                </label>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700">
                  <Bell className="h-4 w-4" />
                  19 alertes stock
                </button>
              </div>
            </div>
          </header>

          <div className="p-6 xl:p-8">
            <DashboardPage />
          </div>
        </main>
      </div>
    </div>
  );
}
