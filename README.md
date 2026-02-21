# BlockchainTPE — Simulation et Visualisation des Consensus Blockchain

> Travail Personnel Encadré (TPE) — Master 1 IWOCS  
> Université Le Havre Normandie · 2025-2026

**Live site**: https://blockchaintpe.netlify.app

---

## À propos du projet

Ce site présente les travaux de recherche et de simulation sur les protocoles de consensus blockchain réalisés dans le cadre du TPE de Master 1 IWOCS. L'objectif est de **rendre visible l'invisible** : simuler et comparer le comportement des trois principaux algorithmes de consensus distribué — Proof of Work (PoW), Proof of Stake (PoS) et Practical Byzantine Fault Tolerance (PBFT) — à travers des modèles multi-agents développés avec AnyLogic.


## Structure du site

| Route | Contenu |
|---|---|
| `/` | Landing page — Introduction, protocoles, architecture, simulation, comparatif, résultats, équipe |
| `/docs/pow` | Documentation Javadoc complète du modèle PoW (AnyLogic) |
| `/docs/pos` | Documentation PoS *(en préparation)* |
| `/docs/pbft` | Documentation PBFT *(en préparation)* |

### Sections de la page d'accueil

1. **Hero** — Présentation du projet et chaîne de blocs animée
2. **Introduction** — Concepts fondamentaux et objectifs
3. **Protocoles** — PoW, PoS et PBFT avec liens documentation et simulation
4. **Architecture** — Modèle multi-agents (Agent Main / Nœud / Messager)
5. **Simulation** — Paramètres et aperçu des métriques
6. **Comparatif** — Tableau comparatif des trois protocoles
7. **Résultats** — Résultats clés et feuille de route
8. **Équipe** — Auteurs et encadrants

---

## Simulation PoW (AnyLogic Cloud)

**Lien direct** : https://cloud.anylogic.com/model/9242c96b-a86c-4923-9641-b5873cdb0804

Le modèle simule un réseau P2P de nœuds mineurs avec :
- Minage PoW par incrémentation de nonce (SHA-256)
- Propagation des blocs et résolution de forks
- Attaques par diffusion de faux blocs
- Perturbateur réseau cyclique (connexions/déconnexions)
- Export des récompenses BTC pour analyse Gnuplot

---

## Stack technique

| Technologie | Usage |
|---|---|
| Vite 5 + React 18 + TypeScript 5 | Base de l'application |
| Tailwind CSS 3.4 | Styles utilitaires |
| Framer Motion 12 | Animations |
| React Router DOM 6 | Navigation SPA |
| Shadcn UI (Radix) | Composants accessibles |
| AnyLogic | Simulation multi-agents |

---

## Développement local

Prérequis : Node.js 18+ et npm (ou bun).

```sh
# Cloner le dépôt
git clone https://github.com/hocine-dev/tpe.git
cd tpe

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera disponible sur `http://localhost:8080`.

```sh
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

---

## Déploiement

Le site est déployé automatiquement sur **Netlify** à chaque push sur la branche `main`.

```
Site   : https://blockchaintpe.netlify.app
Branch : main
Build  : npm run build
Output : dist/
```
- Edit files directly within the Codespace and commit and push your changes once you're done.