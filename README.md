AST V1 — Spécification Officielle

Langage déclaratif de stratégies de trading (POC)
1. Objectif

Ce document définit la spécification officielle de l’AST V1 (Abstract Syntax Tree) utilisé pour décrire des stratégies de trading sous forme déclarative, non linéaire et orientée graphe.

La V1 est conçue comme un POC structurant : minimale, mais suffisamment expressive pour révéler les véritables problèmes du trading réel.

Principe clé :
La V1 décrit une stratégie. La V2 l’exécutera.
2. Portée et intentions

L’AST V1 vise à :

    représenter fidèlement des stratégies réelles

    casser les hypothèses implicites de linéarité (pipeline)

    permettre des graphes complexes (conditions, branches, multi‑sources)

    rester strictement déclaratif

La V1 ne vise pas :

    l’exécution

    l’évaluation des conditions

    le calcul des indicateurs

    la résolution des dépendances

    l’optimisation ou le scheduling

3. Principe fondamental

Le graphe construit dans l’éditeur EST l’AST.

Il n’existe :

    ni compilation intermédiaire

    ni transformation cachée

    ni logique implicite

Le node Backtest agit uniquement comme observateur et sérialiseur.
Il ne modifie jamais la structure de l’AST.
4. Déclaratif strict

L’AST V1 :

    n’exécute rien

    n’évalue aucune condition

    ne calcule aucun indicateur

    ne définit aucun ordre d’exécution

Chaque node décrit une intention, jamais une action.
5. Le graphe comme modèle fondamental

L’AST V1 est un graphe orienté :

    non linéaire

    potentiellement multi‑racines

    potentiellement multi‑parents

    potentiellement cyclique (déclaratif)

Ce n’est ni un pipeline, ni une liste ordonnée, ni un graphe d’exécution.
6. Non‑linéarité assumée

La non‑linéarité est intrinsèque aux stratégies de trading réelles.

Cas supportés nativement :

    bifurcations conditionnelles

    convergences logiques (fan‑in)

    indicateurs multi‑sources

    multi‑tickers

    sous‑stratégies

    contextes conditionnés

Toute tentative de linéarisation est hors périmètre V1.
7. Structure JSON canonique

L’AST V1 est sérialisé sous forme de graphe JSON.

Il n’existe :

    aucun ordre implicite

    aucune hiérarchie cachée

    aucune logique d’exécution

L’AST décrit une structure, jamais un comportement.
7.1 Racine de l’AST

Structure logique minimale :

    ast : racine du document

    nodes : dictionnaire de nodes

    chaque clé de nodes est un identifiant unique

    l’ordre des clés n’a aucune signification

7.2 Identité des nodes

Chaque node est identifié par un node_id.

Le node_id :

    est unique dans l’AST

    est librement choisi

    n’a aucune sémantique fonctionnelle

Il sert uniquement à exprimer la structure et les dépendances.
7.3 Structure générale d’un node

Un node contient :

    un champ type obligatoire

    un champ inputs optionnel

    des propriétés spécifiques à son type

7.4 Sémantique de inputs

Le champ inputs décrit des dépendances logiques.

Il ne représente jamais :

    un ordre d’évaluation

    une séquence de calcul

    une exécution implicite

Conséquences :

    plusieurs parents sont autorisés

    un même node peut être réutilisé

    l’AST peut être non linéaire ou arborescent

7.5 Absence d’ordre et de résolution

La V1 :

    ne définit aucun ordre temporel

    ne définit aucun scheduling

    ne résout aucun graphe

    n’évalue aucune condition

Les cycles sont autorisés à titre déclaratif uniquement.

Principe clé :
Un node décrit ce dont il dépend, pas comment ni quand il sera évalué.
8. Types de nodes V1
8.1 Ticker

Source de marché.
Plusieurs tickers autorisés. Aucun input. Représente un contexte de marché.
8.2 Indicator

Indicateur technique ou composite.
Dépendances multiples autorisées (tickers ou indicateurs).
Support implicite des spreads, ratios, composites et cross‑market.
Aucune sémantique de calcul en V1.
8.3 Condition

Bifurcation structurelle.
Deux sorties logiques (then / else).
Aucune évaluation, aucune décision.
Structure l’AST en sous‑graphes.
8.4 Operator

Opération logique explicite.
Opérateurs supportés : AND, OR, XOR, NOT.
Aucune logique implicite autorisée.
8.5 Backtest

Node terminal d’observation.
Sérialise l’AST, ne modifie rien.
Plusieurs backtests autorisés.
9. Cas non‑linéaires supportés en V1

    bifurcations conditionnelles

    convergences (fan‑in)

    indicateurs multi‑sources

    opérateurs logiques explicites

    sous‑stratégies

    contextes conditionnés

    multi‑ticker / cross‑market

    réutilisation de nodes

    cycles déclaratifs

    backtests multiples

Une V1 qui ne couvre pas ces cas est trompeuse.
10. Ce que la V1 ne fait pas

La V1 :

    n’exécute pas

    n’évalue pas les conditions

    ne choisit pas de branche

    ne calcule aucun indicateur

    ne définit aucun ordre temporel

    ne résout aucun graphe

11. Frontière V1 / V2

V1 : Déclaration, AST, Graphe, Structure, POC
V2 : Exécution, Moteur, Pipeline/DAG, Résolution, Production
12. Principe directeur final

La V1 doit être minimale, mais suffisamment expressive pour révéler tous les problèmes structurels du trading réel.

Statut :
Version AST V1 — Nature POC — Exécution hors périmètre