# ⚠️ IMPORTANT - QUEL FICHIER COMPILER ?

## ✅ Fichier à Compiler : `rapport_synapse.tex`

Vous devez compiler **`rapport_synapse.tex`** (le nouveau rapport SynapseAI), PAS `rapport.tex` (l'ancien template).

## 🔴 Erreurs Actuelles

Les erreurs que vous voyez viennent du fait que vous compilez `rapport.tex` au lieu de `rapport_synapse.tex`.

### Erreurs rencontrées :
- Citations manquantes : `web001`, `Nom2012`, `gen1972`, `schaeffer99`
- Ces citations existent dans le vieux template mais pas dans le nouveau rapport

## 📋 Configuration Overleaf

### Sur Overleaf :

1. **Cliquez sur le menu (≡) en haut à gauche**
2. **Allez dans "Settings"**
3. **Trouvez "Main document"**
4. **Changez de :** `rapport.tex`
5. **À :** `rapport_synapse.tex`
6. **Cliquez sur "Recompile"**

### Structure des fichiers :

```
Rapport1/
├── rapport.tex              ← ❌ ANCIEN TEMPLATE (ne pas utiliser)
├── rapport_synapse.tex      ← ✅ NOUVEAU RAPPORT (utiliser celui-ci)
├── chapitre1.tex            ← ❌ Vieux chapitre
├── chapitre2.tex            ← ❌ Vieux chapitre
├── introduction.tex         ← ❌ Vieille intro
├── chapitre1_contexte.tex   ← ✅ Nouveau chapitre 1
├── chapitre2_etat_art.tex   ← ✅ Nouveau chapitre 2
├── chapitre3_sprint1.tex    ← ✅ Nouveau chapitre 3
├── chapitre4_sprint2.tex    ← ✅ Nouveau chapitre 4
├── chapitre5_sprint3.tex    ← ✅ Nouveau chapitre 5
├── introduction_generale_synapse.tex  ← ✅ Nouvelle intro
├── conclusion_generale_synapse.tex    ← ✅ Nouvelle conclusion
├── resume_abstract_synapse.tex        ← ✅ Nouveau résumé
└── Biblio.bib               ← ✅ Bibliographie (corrigée)
```

## ✅ Corrections Appliquées

Les erreurs de compilation suivantes ont été corrigées dans `rapport_synapse.tex` :

1. ✅ Ajout du package `\usepackage{url}` avant hyperref
2. ✅ Correction de la syntaxe dans Biblio.bib ligne 156 (virgule manquante)
3. ✅ Toutes les citations sont maintenant valides

## 🚀 Étapes à Suivre

1. **Sur Overleaf** : Changez le "Main document" pour `rapport_synapse.tex`
2. **Recompilez** (bouton vert "Recompile")
3. **Le rapport devrait compiler sans erreur** ✓

## 📝 Note

Si vous souhaitez supprimer les anciens fichiers template pour éviter toute confusion :
- `rapport.tex`
- `chapitre1.tex`
- `chapitre2.tex`
- `introduction.tex`
- `abstract.tex`
- `Accord_depot.tex`

Ces fichiers ne sont plus nécessaires puisque tout le contenu est dans les nouveaux fichiers `*_synapse.tex`.

## ❓ En cas de problème

Si après avoir changé le main document vous avez toujours des erreurs :

1. Vérifiez que vous compilez bien avec **pdfLaTeX**
2. Videz le cache : Menu → "Logs and output files" → "Clear cached files"
3. Recompilez

Le rapport devrait alors générer un PDF de ~80-100 pages sur SynapseAI ! 🎓
