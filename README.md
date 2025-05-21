# 🎤 SKIT – L'histoire du hip-hop français

**SKIT** est un site web interactif et immersif qui retrace l’histoire du hip-hop français, **année par année**, depuis ses débuts jusqu’à aujourd’hui.  
Chaque scroll permet de plonger dans les événements marquants, les sorties d’albums, les concerts et les évolutions majeures du mouvement.

---

## 🧠 Concept

Inspiré par les *skits* des albums de rap — ces interludes qui racontent une histoire — le site **SKIT** agit comme une **timeline visuelle**, fluide et épurée, destinée à tous les publics : amateurs, passionnés, chercheurs ou simples curieux.

---

## 🛠️ Tech stack

- **HTML5 / CSS3**
- **TypeScript**
- **JSON** pour la gestion des données annuelles
- **IntersectionObserver API** pour le chargement dynamique au scroll
- **Polices personnalisées** : Akira, Draper, Open Sans

---

## 📁 Structure du projet

hiphop-history/
├── index.html # Page principale
├── style.css # Styles globaux
├── src/
│ └── script.ts # Code principal en TypeScript
├── dist/
│ └── script.js # Fichier compilé automatiquement
├── data/
│ ├── 1990.json # Données par année
│ └── 1991.json
├── fonts/ # Polices personnalisées
└── tsconfig.json # Configuration TypeScript


---

## 🚀 Lancer le projet en local

1. Cloner le dépôt :
```bash
git clone git@github.com:haurujenkins/hipophistory.git
cd hipophistory

npm install
npx tsc
```
ouvrir index.html dans un navigateur