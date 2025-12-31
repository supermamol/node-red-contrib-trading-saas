# Trading SaaS — V1

## Objectif

La V1 fournit un éditeur visuel de stratégies de trading basé sur Node-RED.

Elle permet de :
- composer un graphe valide
- décrire une stratégie de trading
- valider la cohérence structurelle
- préparer les bases d’un moteur V2

La V1 est déclarative :
elle décrit des stratégies, elle ne les exécute pas.

---

## Philosophie générale

Le système repose sur un langage visuel permettant de décrire une stratégie
de trading sous forme de graphe.

Un node ne consomme pas des données temps réel :
il dépend de sources logiques.

Le graphe est un graphe de dépendances, pas un data-flow strict.

---

## Périmètre V1

### Inclus
- Éditeur Node-RED
- Validation globale des connexions (policy editor-side)
- Nodes :
  - Ticker
  - Indicator
  - Condition
  - Backtest

### Hors V1
- Exécution temps réel
- Backtesting financier réel
- Trading live
- Gestion du risque
- Portefeuilles

---

## Nodes

### Ticker
- Type logique : Market
- Rôle : décrire un marché (symbole, timeframe)
- Inputs : 0
- Outputs : 1

### Indicator
- Type logique : Indicator
- Rôle : décrire un indicateur simple ou composite
- Inputs : 1 (agrégateur implicite)
- Outputs : 1

### Condition
- Type logique : Decision
- Rôle : exprimer une règle logique
- Inputs : 1
- Outputs : 1

### Backtest
- Type logique : Terminal
- Rôle : terminal du graphe
- Inputs : 1
- Outputs : 0

---

## Inputs & Cardinalité — Spécification V1

Chaque node expose un input unique.

Cet input est un agrégateur implicite de sources :
- 0 source : INCOMPLETE
- ≥ 1 source : OK

Il n’existe aucune limite maximale au nombre de connexions entrantes.

---

## Types logiques de sources

- Market : Ticker
- Indicator : Indicator
- Decision : Condition
- Terminal : Backtest

Ces types sont conceptuels et non exposés comme ports distincts.

---

## Connexions autorisées

- Ticker → Indicator
- Indicator → Indicator
- Indicator → Condition
- Indicator → Backtest
- Condition → Backtest

---

## Connexions interdites

- Ticker → Backtest
- Condition → Indicator
- Backtest → *
- Condition → Condition (V1)

---

## Outputs — Spécification V1

Chaque node (sauf Backtest) expose un output unique.

L’output propage une description enrichie,
il ne déclenche aucune exécution réelle.

---

## Propagation du message (exemple conceptuel)

{
  "market": { "symbol": "AAPL", "timeframe": "1D" },
  "indicators": [
    { "type": "EMA", "period": 20 },
    { "type": "RSI", "period": 14 }
  ],
  "conditions": [
    { "operator": ">", "value": 50 }
  ],
  "backtest": {
    "from": "2020-01-01",
    "to": "2023-01-01"
  }
}

---

## Policy globale

Les règles de compatibilité sont définies globalement
et appliquées editor-side.

La policy :
- empêche les connexions invalides
- nettoie les flows existants au chargement
- garantit la cohérence sémantique du graphe

---

## Node technique interne

Policy Loader :
- config node
- non posable dans un flow
- invisible pour l’utilisateur
- chargé automatiquement par l’éditeur

---

## Structure du projet

nodes/
- ticker/
- indicator/
- condition/
- backtest/
- policy-loader/

---

## Positionnement V1 / V2

V1 :
- déclaratif
- linéaire
- validation structurelle

V2 :
- exécution réelle
- branches conditionnelles
- moteur de trading
- backtesting avancé
- live trading

---

## Synthèse

La V1 permet de décrire proprement une stratégie de trading
via un graphe valide, cohérent et extensible,
sans exécution réelle.
