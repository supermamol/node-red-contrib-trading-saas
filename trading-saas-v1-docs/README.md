# Trading SaaS — V1
## Langage visuel d’analyse et de backtest (Node‑RED)

---

## 1. Objectif de la V1

La **V1** fournit un **langage visuel simple, permissif et cohérent** permettant de :

- analyser un marché financier,
- calculer et chaîner des indicateurs techniques,
- définir des règles simples,
- backtester des comportements de marché,
- sans ambiguïté structurelle,
- sans stratégie explicite,
- sans exécution réelle,
- sans validation bloquante liée au déploiement.

👉 **La V1 n’est pas un moteur de trading**, mais un **outil d’analyse et de backtest de comportements**.

---

## 2. Philosophie générale

- Le graphe décrit un **pipeline d’analyse**, pas une stratégie complète.
- La validation est **design‑time uniquement**.
- **Aucune validation n’implique un deploy**.
- Alignement strict avec **Node‑RED**.
- La complexité est volontairement repoussée en **V2**.

---

## 3. Périmètre fonctionnel

### Inclus en V1
- Ticker
- Indicator
- Condition
- Backtest

### Hors périmètre (V2)
- Strategy explicite
- AND / OR / NOT
- Risk management
- Multi‑ticker
- Multi‑timeframe
- Exécution réelle

---

## 4. Graphe autorisé

Ticker → Indicator* → Condition* → Backtest

---

## 5. Nodes

### Ticker
Source unique de marché  
1 Ticker par flow

Outputs : market  
Connexions : Ticker → Indicator

---

### Indicator (générique V1)

- 1 input unique
- Connexions multiples autorisées (Node‑RED natif)
- Sources possibles : Ticker, Indicator(s)

Un indicateur peut dépendre :
- du marché
- d’autres indicateurs
- des deux

Il reçoit toutes les sources disponibles et décide en interne.

---

### Condition

- Entrée : indicators
- Sortie : boolean
- Comparaison simple uniquement
- Pas de logique AND / OR

---

### Backtest

Node terminal

Entrée :
- indicators → analyse
- condition → stratégie implicite

---

## 6. Règles de raccordement

Ticker → Indicator  
Indicator → Indicator  
Indicator → Condition  
Indicator → Backtest  
Condition → Backtest  

Tout autre raccordement est interdit.

---

## 7. Validation (éditeur uniquement)

- La validation n’implique PAS de deploy
- États possibles :
  - ok
  - incomplete
  - error

Un indicateur est **incomplete** tant que toutes ses sources requises ne sont pas raccordées.

---

## 8. Décisions de design

- Input unique avec connexions multiples
- Validation permissive
- Responsabilité métier dans les nodes
- Simplicité V1, extensibilité V2

---

## 9. V2 (aperçu)

- Strategy explicite
- AND / OR
- Ports déclaratifs
- Multi‑ticker
- Validation stricte

---

## 10. Résumé

La V1 propose un langage visuel simple et cohérent pour analyser et backtester des comportements de marché, aligné avec Node‑RED.
