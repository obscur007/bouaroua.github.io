import { BarChart3, Boxes, CircleDollarSign, CreditCard, LayoutDashboard, Search, ShoppingCart, Truck, Users } from 'lucide-react';

const items = [
  { label: 'Tableau de bord', icon: LayoutDashboard, active: true },
  { label: 'Produits', icon: Boxes },
  { label: 'Catégories', icon: Search },
  { label: 'Fournisseurs', icon: Truck },
  { label: 'Clients', icon: Users },
  { label: 'Ventes', icon: ShoppingCart },
  { label: 'Crédits', icon: CreditCard },
  { label: 'Finances', icon: CircleDollarSign },
  { label: 'Rapports', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-full max-w-72 flex-col border-r border-slate-200 bg-slate-950 px-5 py-6 text-slate-100">
      <div>
        <div className="rounded-2xl bg-brand-500/15 p-4 ring-1 ring-brand-500/30">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-100">Gestion Stock Pro</p>
          <h1 className="mt-2 text-2xl font-semibold">Boutique Offline</h1>
          <p className="mt-2 text-sm text-slate-300">Ventes, stock, crédit et reporting local en MAD.</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {items.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              active
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-sm text-slate-300 ring-1 ring-slate-800">
        <p className="font-semibold text-white">Base de données locale</p>
        <p className="mt-2">SQLite stockée dans un dossier choisi par l'utilisateur avec sauvegarde JSON/XLSX.</p>
      </div>
    </aside>
  );
}
