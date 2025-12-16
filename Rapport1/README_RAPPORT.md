# Rapport de Projet de Fin d'Études - SynapseAI

## Description

Ce dossier contient le rapport académique complet du projet SynapseAI, une plateforme intelligente d'apprentissage et de collaboration basée sur les modèles de langage (LLM).

## Structure du Rapport

Le rapport est organisé selon le template académique fourni et comprend :

### Fichiers Principaux

- **rapport_synapse.tex** : Fichier LaTeX principal
- **Biblio.bib** : Bibliographie complète

### Chapitres

1. **resume_abstract_synapse.tex** : Résumé en français et abstract en anglais
2. **introduction_generale_synapse.tex** : Introduction générale du projet
3. **chapitre1_contexte.tex** : Contexte général du projet
4. **chapitre2_etat_art.tex** : État de l'art et spécification des besoins
5. **chapitre3_sprint1.tex** : Sprint 1 - Infrastructure et Chat Multi-LLM
6. **chapitre4_sprint2.tex** : Sprint 2 - Fonctionnalités avancées d'IA
7. **chapitre5_sprint3.tex** : Sprint 3 - Communauté et administration
8. **conclusion_generale_synapse.tex** : Conclusion générale et perspectives

## Contenu du Rapport

### Caractéristiques Techniques Couvertes

- **Multi-LLM Integration** : GPT-4, Claude, Gemini
- **Analyse de Documents** : PDF, DOCX, TXT avec extraction de résumés et concepts
- **Génération de Graphiques** : Chart.js avec Line, Bar, Pie, Doughnut
- **Recommandations YouTube** : API YouTube Data v3 avec extraction de mots-clés
- **Espace Communautaire** : Posts, commentaires, likes
- **Générateur d'Exercices** : Génération et correction automatique
- **Tableau de Bord Administratif** : Gestion utilisateurs et statistiques

### Méthodologie

- Approche SCRUM avec 3 sprints de 4 semaines
- Modélisation UML complète
- Tests fonctionnels exhaustifs

## Compilation du Rapport

### Option 1 : Overleaf (Recommandé)

1. Créer un nouveau projet sur [Overleaf](https://www.overleaf.com)
2. Uploader tous les fichiers .tex et le fichier Biblio.bib
3. Définir `rapport_synapse.tex` comme Main Document
4. Sélectionner le compilateur : **pdfLaTeX**
5. Cliquer sur "Recompile"

### Option 2 : Compilation Locale

**Prérequis** :
- Distribution LaTeX complète (TeX Live, MiKTeX)
- Packages requis : babel, algorithm2e, listings, xcolor, hyperref, etc.

**Commandes** :
```bash
pdflatex rapport_synapse.tex
bibtex rapport_synapse
pdflatex rapport_synapse.tex
pdflatex rapport_synapse.tex
```

## Packages LaTeX Utilisés

- `graphicx` : Insertion d'images
- `babel[french]` : Support du français
- `algorithm2e` : Algorithmes
- `amsthm` : Théorèmes et définitions
- `listings` : Affichage de code
- `xcolor` : Couleurs
- `float` : Positionnement des figures
- `caption` : Légendes
- `tabularx` : Tableaux avancés
- `hyperref` : Liens hypertextes

## Placeholders pour Figures

Le rapport contient des placeholders pour les figures suivantes (à remplacer par de vraies captures d'écran) :

### Chapitre 1
- Comparaison des plateformes existantes
- Architecture globale de SynapseAI
- Cycle SCRUM
- Diagramme de Gantt

### Chapitre 2
- Comparaison des capacités des LLM
- Diagramme de cas d'utilisation global
- Stack technologique

### Chapitre 3
- Diagrammes de cas d'utilisation détaillés
- Diagrammes de séquence (inscription, OAuth, chat)
- Diagramme de classes Sprint 1
- Captures d'écran des interfaces (inscription, connexion, chat, historique)

### Chapitre 4
- Diagrammes UML Sprint 2
- Captures d'écran (workspace documents, graphiques, recommandations YouTube)

### Chapitre 5
- Diagrammes UML Sprint 3
- Captures d'écran (feed communautaire, détail post, exercices, dashboard admin)

## Personnalisation

Pour personnaliser le rapport, modifier les variables suivantes dans `rapport_synapse.tex` :

```latex
\newcommand{\reportAuthor}{Votre Nom Prénom}
\newcommand{\reportSupervisor}{Encadrant Académique : M./Mme. [Nom]}
\newcommand{\reportModule}{Module : Projet de Fin d'Études}
```

## Structure Académique Respectée

✓ Page de garde conforme
✓ Remerciements
✓ Résumé (Français) et Abstract (Anglais)
✓ Table des matières
✓ Liste des figures
✓ Liste des tableaux
✓ Liste des algorithmes
✓ Introduction générale
✓ 5 chapitres structurés
✓ Conclusion générale et perspectives
✓ Bibliographie

## Statistiques du Rapport

- **Nombre de pages** : ~80-100 pages
- **Nombre de chapitres** : 5 + introduction + conclusion
- **Nombre de figures** : ~30 (placeholders)
- **Nombre de tableaux** : ~15
- **Nombre de listings de code** : ~15
- **Références bibliographiques** : 20

## Fonctionnalités Documentées

### ✓ Incluses (Réelles)
- Multi-LLM (GPT-4, Claude, Gemini)
- Analyse de documents (sans RAG/embeddings)
- Génération de graphiques (Chart.js)
- Recommandations YouTube
- Communauté (Posts, Comments, Likes)
- Générateur d'exercices
- Dashboard administratif

### ✗ Non Incluses (Clarification)
- Système de classification
- RAG (Retrieval-Augmented Generation)
- Embeddings vectoriels
- Recherche par similarité

## Notes Importantes

1. **Figures** : Tous les placeholders de figures doivent être remplacés par de vraies captures d'écran ou diagrammes UML
2. **Personnalisation** : Adapter les noms, dates et informations spécifiques à votre contexte
3. **Bibliographie** : Ajouter vos propres références si nécessaire
4. **Compilation** : Le rapport nécessite 3 compilations pdfLaTeX pour générer correctement les références croisées

## Support

Pour toute question concernant la compilation ou le contenu du rapport, se référer aux fichiers suivants dans le dossier Rapport principal :
- `COMPILATION_GUIDE.md`
- `OVERLEAF_GUIDE.md`

## Licence

Ce rapport est créé dans le cadre d'un projet académique.

## Année Universitaire

2024-2025
