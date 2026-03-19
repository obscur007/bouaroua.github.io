export type KpiCard = {
  title: string;
  value: string;
  delta: string;
  tone: 'primary' | 'warning' | 'success';
};

export type Movement = {
  label: string;
  reference: string;
  quantity: string;
  date: string;
  type: 'Entrée' | 'Sortie';
};

export type SaleLine = {
  product: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
};

export type SaleRecord = {
  id: string;
  customer: string;
  paymentMethod: 'Espèces' | 'Chèque' | 'Crédit';
  date: string;
  total: number;
  profit: number;
  status: 'Payée' | 'Partielle' | 'En attente';
  lines: SaleLine[];
};

export const dashboardKpis: KpiCard[] = [
  { title: 'Produits actifs', value: '1 248', delta: '+38 ce mois', tone: 'primary' },
  { title: 'Alertes stock bas', value: '19', delta: '5 critiques', tone: 'warning' },
  { title: 'Valeur du stock', value: '428 560 MAD', delta: '+7,4 %', tone: 'success' },
  { title: 'Crédits impayés', value: '63 200 MAD', delta: '14 dossiers', tone: 'warning' },
];

export const recentMovements: Movement[] = [
  { label: 'Vente comptoir', reference: 'VENT-2026-0319', quantity: '-6 unités', date: '19/03/2026 · 11:42', type: 'Sortie' },
  { label: 'Réception fournisseur Atlas', reference: 'APP-2026-0074', quantity: '+30 unités', date: '19/03/2026 · 10:12', type: 'Entrée' },
  { label: 'Ajustement inventaire', reference: 'AJU-2026-0011', quantity: '-2 unités', date: '18/03/2026 · 18:40', type: 'Sortie' },
  { label: 'Retour client', reference: 'RET-2026-0004', quantity: '+1 unité', date: '18/03/2026 · 15:08', type: 'Entrée' },
];

export const products = [
  {
    sku: 'TEL-SMS-A14',
    name: 'Samsung Galaxy A14',
    category: 'Téléphones',
    supplier: 'Atlas Mobile',
    purchasePrice: '1 450 MAD',
    sellingPrice: '1 890 MAD',
    stock: 17,
    minStock: 10,
  },
  {
    sku: 'ACC-CHG-45W',
    name: 'Chargeur USB-C 45W',
    category: 'Accessoires',
    supplier: 'Casa Tech Supply',
    purchasePrice: '85 MAD',
    sellingPrice: '140 MAD',
    stock: 9,
    minStock: 12,
  },
  {
    sku: 'TEL-RED-13C',
    name: 'Xiaomi Redmi 13C',
    category: 'Téléphones',
    supplier: 'Atlas Mobile',
    purchasePrice: '1 120 MAD',
    sellingPrice: '1 420 MAD',
    stock: 26,
    minStock: 8,
  },
];

export const suppliers = [
  { company: 'Atlas Mobile', contact: 'Yassine B.', phone: '+212 661 00 11 22', email: 'contact@atlasmobile.ma', products: 48 },
  { company: 'Casa Tech Supply', contact: 'Nadia F.', phone: '+212 662 70 88 10', email: 'sales@casatech.ma', products: 112 },
  { company: 'Rabat Distribution', contact: 'Anas M.', phone: '+212 600 33 21 09', email: 'anas@rabatdist.ma', products: 37 },
];

export const customers = [
  { name: 'Ahmed El Idrissi', phone: '+212 668 22 33 11', address: 'Hay Riad, Rabat', balance: '1 800 MAD' },
  { name: 'Sara Benali', phone: '+212 650 40 10 90', address: 'Maarif, Casablanca', balance: '0 MAD' },
  { name: 'Khalid Bousfiha', phone: '+212 675 90 12 88', address: 'Guéliz, Marrakech', balance: '4 250 MAD' },
];

export const salesHistory: SaleRecord[] = [
  {
    id: 'VENT-2026-0319',
    customer: 'Ahmed El Idrissi',
    paymentMethod: 'Crédit',
    date: '19/03/2026',
    total: 2990,
    profit: 790,
    status: 'Partielle',
    lines: [
      { product: 'Samsung Galaxy A14', quantity: 1, purchasePrice: 1450, sellingPrice: 1890 },
      { product: 'Chargeur USB-C 45W', quantity: 1, purchasePrice: 85, sellingPrice: 140 },
      { product: 'Écouteurs Bluetooth', quantity: 1, purchasePrice: 520, sellingPrice: 960 },
    ],
  },
  {
    id: 'VENT-2026-0318',
    customer: 'Client comptoir',
    paymentMethod: 'Espèces',
    date: '18/03/2026',
    total: 1420,
    profit: 300,
    status: 'Payée',
    lines: [{ product: 'Xiaomi Redmi 13C', quantity: 1, purchasePrice: 1120, sellingPrice: 1420 }],
  },
];

export const credits = [
  {
    id: 'CRD-2026-0008',
    customer: 'Ahmed El Idrissi',
    saleRef: 'VENT-2026-0319',
    total: '2 990 MAD',
    paid: '1 190 MAD',
    remaining: '1 800 MAD',
    nextDue: '25/03/2026',
    items: 'Samsung Galaxy A14, Chargeur USB-C 45W, Écouteurs Bluetooth',
  },
  {
    id: 'CRD-2026-0007',
    customer: 'Khalid Bousfiha',
    saleRef: 'VENT-2026-0308',
    total: '5 400 MAD',
    paid: '1 150 MAD',
    remaining: '4 250 MAD',
    nextDue: '22/03/2026',
    items: 'Routeur, Caméra IP, Disque SSD 1 To',
  },
];

export const architectureLayers = [
  {
    title: 'Desktop Shell · Electron',
    description:
      'Fenêtre native, dialogues système pour choisir le dossier SQLite, génération de sauvegardes et packaging installateur hors-ligne.',
  },
  {
    title: 'Frontend · React + TypeScript + Tailwind',
    description:
      'Interface française orientée productivité avec navigation latérale, tableaux filtrables, modales et tableaux de bord financiers.',
  },
  {
    title: 'Offline Services · IPC sécurisé',
    description:
      'Pont preload exposant des APIs strictement typées pour les ventes, produits, crédits, sauvegardes et paramètres.',
  },
  {
    title: 'Persistence · SQLite locale',
    description:
      'Base de données locale versionnée, transactions atomiques, export JSON/XLSX et restauration complète sans dépendance cloud.',
  },
];
