# Gestion Stock Pro · Application desktop hors-ligne

Gestion Stock Pro est une base de projet **production-ready** pour une application desktop de **gestion de stock, ventes et crédits** destinée aux petits commerces.

L'application est conçue pour fonctionner **100 % hors-ligne** avec :

- **React + TypeScript + TailwindCSS** pour l'interface.
- **Electron** pour l'enveloppe desktop et l'accès natif au système de fichiers.
- **SQLite locale** pour la persistance des données.
- **Prisma** comme schéma ORM de référence, avec une implémentation runtime simple via **better-sqlite3**.
- **XLSX** pour les exports Excel.

## 1. Architecture de l'application

### Vue d'ensemble

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                             Interface React                              │
│  Dashboard · Produits · Catégories · Fournisseurs · Clients · Ventes    │
│  Crédits · Recherche globale · Rapports · Modales                        │
└───────────────▲───────────────────────────────────────────────────────────┘
                │ IPC sécurisé via preload
┌───────────────┴───────────────────────────────────────────────────────────┐
│                            Electron Main Process                         │
│  Fenêtre desktop · Dialogues système · Choix dossier DB · Backup/Restore│
│  Export JSON · Export XLSX · Packaging installateur                     │
└───────────────▲───────────────────────────────────────────────────────────┘
                │ accès local
┌───────────────┴───────────────────────────────────────────────────────────┐
│                             SQLite Locale                                │
│  Produits · Catégories · Fournisseurs · Clients · Ventes · Crédits      │
│  Paiements · Mouvements de stock · Résumés financiers                   │
└───────────────────────────────────────────────────────────────────────────┘
```

### Principes d'architecture

- **Offline-first réel** : aucune dépendance cloud, aucune API distante, aucune authentification externe.
- **Base de données locale hors navigateur** : fichier SQLite sur disque, choisi par l'utilisateur grâce à une boîte de dialogue système Electron.
- **Séparation stricte** :
  - `src/` pour le frontend React.
  - `electron/main/` pour les opérations desktop natives.
  - `electron/shared/` pour les contrats typés entre frontend et backend local.
  - `prisma/` pour le schéma de données et l'évolution future du modèle.
- **Sécurité desktop** : `contextIsolation: true`, `nodeIntegration: false`, exposition IPC minimale via preload.
- **Portabilité** : build installable Windows / macOS / Linux via `electron-builder`.

## 2. Structure du dossier

```text
.
├── electron/
│   ├── main/
│   │   ├── database.ts         # Initialisation SQLite + migrations locales
│   │   ├── main.ts             # Fenêtre Electron + IPC + backup/restore
│   │   ├── preload.ts          # API sécurisée exposée au renderer
│   │   └── repositories.ts     # Requêtes métier offline
│   └── shared/
│       └── contracts.ts        # Types partagés frontend/backend
├── prisma/
│   └── schema.prisma           # Schéma relationnel de référence
├── src/
│   ├── components/             # Sidebar, cartes KPI, tables réutilisables
│   ├── data/                   # Données de démonstration UI
│   ├── pages/                  # Pages métier
│   ├── styles/                 # Tailwind + styles globaux
│   ├── App.tsx                 # Shell principal de l'interface
│   └── main.tsx                # Entrée React
├── .env.example                # Exemple d'URL Prisma SQLite
├── index.html                  # Entrée Vite
├── package.json                # Dépendances, scripts et packaging
├── tailwind.config.ts          # Thème UI
├── tsconfig.json               # Config TypeScript frontend
├── tsconfig.electron.json      # Config TypeScript Electron
└── vite.config.ts              # Config Vite
```

## 3. Schéma de base de données

### Entités principales

- `categories`
- `suppliers`
- `customers`
- `products`
- `sales`
- `sale_items`
- `credit_sales`
- `credit_payments`
- `stock_movements`

### Relations métier

- Un **produit** appartient facultativement à une **catégorie** et à un **fournisseur**.
- Une **vente** contient plusieurs **lignes de vente**.
- Une **vente à crédit** référence une **vente** et un **client**.
- Une **vente à crédit** possède plusieurs **paiements d'échéances**.
- Chaque **mouvement de stock** référence un **produit**.

### Couverture fonctionnelle du schéma

- **Produits** : nom, SKU, catégorie, fournisseur, prix achat, prix vente, stock, seuil minimum.
- **Fournisseurs** : société, contact, email, téléphone, adresse.
- **Clients** : nom, téléphone, adresse.
- **Ventes** : multi-produits, méthode de paiement, coût, profit, date.
- **Crédits** : total, payé, restant, statut automatique.
- **Stock** : mouvements d'entrée/sortie/ajustement/retour.
- **Reporting** : synthèses journalières, mensuelles, crédits impayés, valorisation du stock.

## 4. Fonctionnalités implémentées dans ce socle

### Tableau de bord

- KPI métier : produits, alertes stock, valeur de stock, crédits impayés.
- Résumé quotidien : ventes, coût d'achat, profit.
- Résumé mensuel : ventes, coût, profit, crédits non soldés.
- Liste des mouvements de stock récents.

### Gestion métier

- Catalogue produits avec informations de stock et seuil minimal.
- Gestion fournisseurs et clients.
- Historique des ventes avec profit par transaction.
- Visualisation des crédits et échéances.
- Recherche globale en façade (point d'entrée UI).

### Services desktop offline

- Choix du dossier de stockage SQLite.
- Création initiale automatique du fichier SQLite.
- Export complet de la base en **JSON**.
- Export du reporting ventes en **Excel `.xlsx`**.
- Import / restauration complète depuis un backup JSON.

## 5. Fichiers source clés

### Frontend

- `src/App.tsx` : shell principal avec barre supérieure et recherche globale.
- `src/pages/DashboardPage.tsx` : démonstration complète de l'UI métier en français.
- `src/components/DataTable.tsx` : composant de table filtrable/réutilisable.
- `src/components/Sidebar.tsx` : navigation latérale desktop.

### Backend desktop

- `electron/main/main.ts` : création de fenêtre, dialogues système, handlers IPC.
- `electron/main/database.ts` : création de la base locale et migrations SQL.
- `electron/main/repositories.ts` : logique métier offline et exports JSON/XLSX.
- `electron/main/preload.ts` : surface d'API sécurisée pour le renderer.

### Données

- `prisma/schema.prisma` : modèle relationnel complet pour évolution future.

## 6. Instructions pour lancer l'application

### Prérequis

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Lancement en mode développement

```bash
npm run dev
```

Ce script démarre :

1. le frontend Vite sur `http://localhost:5173`
2. Electron une fois le serveur prêt

### Vérification TypeScript

```bash
npm run lint
```

### Build de production

```bash
npm run build
```

Le build produit :

- `dist/` pour l'interface React compilée
- `dist-electron/` pour le code Electron compilé

## 7. Instructions pour construire l'installateur desktop

### Build installable multi-plateforme

```bash
npm run package
```

Formats préconfigurés :

- **Windows** : `NSIS`
- **macOS** : `DMG`
- **Linux** : `AppImage`

Les artefacts seront générés dans le dossier :

```text
release/
```

## 8. Stratégie de sauvegarde et restauration

### Sauvegarde

- **Backup JSON complet** : exporte toutes les tables avec métadonnées.
- **Rapport Excel** : exporte l'historique des ventes au format `.xlsx`.

### Restauration

- Sélection d'un fichier JSON via boîte de dialogue native.
- Réinjection transactionnelle des données dans SQLite.
- Possibilité d'automatiser des snapshots planifiés par la suite.

## 9. Évolutions recommandées pour passer en production complète

- Ajouter un vrai router React (`react-router-dom`).
- Brancher les formulaires modaux sur l'API preload.
- Ajouter validations Zod sur tous les formulaires.
- Implémenter pagination, filtres avancés et recherche persistante.
- Créer un module d'impression facture / reçu.
- Ajouter des tests unitaires et E2E Electron.
- Ajouter migrations Prisma versionnées si l'équipe choisit Prisma en runtime.

## 10. Dev notes

- La monnaie cible de toute l'interface est **MAD (Dirham marocain)**.
- Toute l'interface utilisateur est pensée en **français**.
- La démonstration UI est volontairement riche afin de servir de base immédiate à un vrai projet de livraison.
