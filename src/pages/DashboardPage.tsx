import { AlertTriangle, ArchiveRestore, CalendarRange, Download, FolderSync, Wallet } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { SectionHeader } from '../components/SectionHeader';
import { architectureLayers, credits, customers, dashboardKpis, products, recentMovements, salesHistory, suppliers } from '../data/mockData';

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 p-8 text-white shadow-card">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-100">Système de gestion 100 % hors-ligne</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">Application desktop professionnelle pour gérer stock, ventes et crédits en boutique.</h1>
            <p className="mt-4 text-base text-slate-200">
              Conçue pour les petites entreprises avec SQLite local, React + TypeScript côté interface et Electron pour l'accès natif au système de fichiers.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl bg-white/10 p-5 backdrop-blur sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Résumé du jour</p>
              <p className="mt-2 text-2xl font-semibold">12 940 MAD</p>
              <p className="text-sm text-emerald-300">Profit estimé: 3 180 MAD</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Résumé du mois</p>
              <p className="mt-2 text-2xl font-semibold">286 500 MAD</p>
              <p className="text-sm text-amber-300">Crédits non soldés: 63 200 MAD</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <SectionHeader
            title="Architecture proposée"
            description="Une base solide pour livrer une application desktop maintenable et réellement offline."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {architectureLayers.map((layer) => (
              <div key={layer.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">{layer.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <SectionHeader
            title="Actions système"
            description="Fonctionnalités desktop exposées via Electron IPC."
          />
          <div className="grid gap-3">
            {[
              { icon: FolderSync, title: 'Choisir l’emplacement SQLite', text: 'L’utilisateur choisit le dossier de stockage au premier démarrage.' },
              { icon: Download, title: 'Export JSON complet', text: 'Sauvegarde intégrale des tables avec métadonnées.' },
              { icon: ArchiveRestore, title: 'Restauration assistée', text: 'Réimport complet d’une sauvegarde locale.' },
              { icon: Wallet, title: 'Export Excel', text: 'Rapports ventes et finances via fichiers XLSX.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
                <Icon className="mt-1 h-5 w-5 text-brand-500" />
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <SectionHeader
            title="Mouvements de stock récents"
            description="Suivi des entrées, sorties, retours et ajustements d’inventaire."
            action="Nouveau mouvement"
          />
          <DataTable
            columns={[
              { key: 'type', label: 'Type', render: (value) => <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${value === 'Entrée' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{String(value)}</span> },
              { key: 'label', label: 'Libellé' },
              { key: 'reference', label: 'Référence' },
              { key: 'quantity', label: 'Quantité' },
              { key: 'date', label: 'Date' },
            ]}
            data={recentMovements}
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <SectionHeader title="Résumé quotidien" description="Indicateurs de performance du jour." />
          <div className="grid gap-4">
            {[
              { icon: CalendarRange, label: 'Ventes du jour', value: '12 940 MAD' },
              { icon: Wallet, label: 'Coût d’achat vendu', value: '9 760 MAD' },
              { icon: AlertTriangle, label: 'Profit du jour', value: '3 180 MAD' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-brand-100 p-2 text-brand-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-lg font-semibold text-slate-900">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Gestion produits"
          description="Catalogue avec filtre catégorie, seuil minimal et rattachement fournisseur."
          action="Ajouter un produit"
        />
        <DataTable
          columns={[
            { key: 'sku', label: 'SKU', className: 'font-mono text-xs' },
            { key: 'name', label: 'Produit', className: 'font-semibold text-slate-900' },
            { key: 'category', label: 'Catégorie' },
            { key: 'supplier', label: 'Fournisseur' },
            { key: 'purchasePrice', label: 'Prix achat' },
            { key: 'sellingPrice', label: 'Prix vente' },
            {
              key: 'stock',
              label: 'Stock',
              render: (value, row) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${Number(value) <= Number(row.minStock) ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {String(value)} / min {String(row.minStock)}
                </span>
              ),
            },
          ]}
          data={products}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <SectionHeader title="Fournisseurs" description="Annuaire fournisseur avec rattachement de produits." action="Ajouter un fournisseur" />
          <DataTable
            columns={[
              { key: 'company', label: 'Société', className: 'font-semibold text-slate-900' },
              { key: 'contact', label: 'Contact' },
              { key: 'phone', label: 'Téléphone' },
              { key: 'email', label: 'Email' },
              { key: 'products', label: 'Produits liés' },
            ]}
            data={suppliers}
          />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Clients crédit" description="Fiche client avec autocomplétion pour ventes à crédit." action="Ajouter un client" />
          <DataTable
            columns={[
              { key: 'name', label: 'Nom', className: 'font-semibold text-slate-900' },
              { key: 'phone', label: 'Téléphone' },
              { key: 'address', label: 'Adresse' },
              { key: 'balance', label: 'Solde crédit' },
            ]}
            data={customers}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <SectionHeader title="Historique des ventes" description="Ventes multi-produits avec calcul automatique du profit et méthode de paiement." action="Nouvelle vente" />
          <DataTable
            columns={[
              { key: 'id', label: 'Référence', className: 'font-mono text-xs' },
              { key: 'customer', label: 'Client', className: 'font-semibold text-slate-900' },
              { key: 'paymentMethod', label: 'Paiement' },
              { key: 'date', label: 'Date' },
              { key: 'total', label: 'Montant', render: (value) => `${value} MAD` },
              { key: 'profit', label: 'Profit', render: (value) => `${value} MAD` },
              {
                key: 'status',
                label: 'Statut',
                render: (value) => (
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${value === 'Payée' ? 'bg-emerald-100 text-emerald-700' : value === 'Partielle' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {String(value)}
                  </span>
                ),
              },
            ]}
            data={salesHistory}
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <SectionHeader title="Panier de vente" description="Exemple d’interface de caisse multi-lignes." />
          <div className="space-y-3">
            {salesHistory[0].lines.map((line) => (
              <div key={line.product} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{line.product}</p>
                    <p className="text-sm text-slate-500">Qté {line.quantity} · Achat {line.purchasePrice} MAD</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">{line.sellingPrice} MAD</p>
                    <p className="text-xs text-slate-500">Override manuel autorisé</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Total</span>
              <span>2 990 MAD</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Méthode</span>
              <span>Crédit · 1ère échéance encaissée</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Crédits & échéances" description="Suivi des ventes à tempérament, paiements partiels et reste à payer." action="Enregistrer un versement" />
        <DataTable
          columns={[
            { key: 'id', label: 'Crédit', className: 'font-mono text-xs' },
            { key: 'customer', label: 'Client', className: 'font-semibold text-slate-900' },
            { key: 'saleRef', label: 'Vente' },
            { key: 'total', label: 'Montant total' },
            { key: 'paid', label: 'Payé' },
            { key: 'remaining', label: 'Reste' },
            { key: 'nextDue', label: 'Prochaine échéance' },
            { key: 'items', label: 'Produits' },
          ]}
          data={credits}
        />
      </section>
    </div>
  );
}
