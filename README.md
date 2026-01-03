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


ARCHITECTURE V1 — GRAPHE DÉCLARATIF, CARDINALITÉ ET CONNEXIONS

La V1 repose sur un graphe déclaratif construit dans Node‑RED.
Les nodes ne calculent rien : ils décrivent une stratégie sous forme de structure valide, destinée à être interprétée ultérieurement (V2).

L’objectif principal de la V1 est de garantir la validité structurelle du graphe (types de connexions, cardinalité des entrées et sorties), directement au niveau de l’éditeur, avant toute exécution.

GRAPHE GLOBAL AUTORISÉ (V1)

La topologie V1 est strictement la suivante :

Ticker
  ↓
Indicator → Indicator → …
  ↓
Conditions
  ↓ (branches)
Backtest

Toute connexion sortant de ce schéma est interdite et supprimée immédiatement par des policies éditeur.

CARDINALITÉ DES NODES (V1)

NODE : Ticker
Rôle : source absolue de données, point d’entrée unique du graphe.

Entrées :

    0 input

    aucune connexion entrante autorisée

Sorties :

    1 output

    fan‑out autorisé

Exemple :
Ticker → Indicator EMA
       → Indicator RSI

NODE : Indicator (EMA, RSI, etc.)
Rôle : transformation déclarative appliquée à une source.

Entrées :

    1 input

    plusieurs connexions entrantes tolérées en V1

    aucune sémantique garantie en multi‑input

    comportement transitoire (remplacé par un node Combine en V2)

Sorties :

    1 output

Connexions autorisées :
Indicator → Indicator
Indicator → Conditions
Indicator → Backtest

NODE : Conditions
Rôle : point de décision déclaratif définissant des branches logiques.

Entrées :

    1 input

    UNE SEULE connexion entrante autorisée

Toute tentative de connexion supplémentaire est :

    immédiatement supprimée

    signalée à l’utilisateur

Cette contrainte est strictement imposée côté éditeur via une policy dédiée.

Sorties :

    N outputs dynamiques

    N = nombre de règles définies

    chaque output représente une branche logique indépendante

    les sorties peuvent être connectées ou laissées vides (accepté en V1)

NODE : Backtest
Rôle : node terminal, consommateur du graphe.

Entrées :

    N inputs autorisés

    plusieurs branches issues de Conditions peuvent converger vers un même Backtest

Sorties :

    0 output

    toute sortie est interdite

POLICIES ÉDITEUR (V1)

La validité du graphe est garantie avant exécution, directement dans l’éditeur, via des nodes invisibles (non affichés dans la palette).

POLICY GLOBALE : policy-loader

Whitelist stricte des connexions autorisées entre types de nodes :

ticker → indicator
indicator → indicator | conditions | backtest
conditions → backtest
backtest → aucune sortie

Toute connexion interdite est supprimée immédiatement avec notification explicite.

POLICY SPÉCIFIQUE : Conditions

Règle locale indépendante :

Un node Conditions ne peut avoir qu’une seule source en entrée.

Cette règle est :

    implémentée via une policy dédiée

    séparée volontairement de la policy globale

    responsable uniquement de la cardinalité d’entrée

PHILOSOPHIE DE LA V1

La V1 est volontairement descriptive.

Elle vise à :

    être stricte là où la sémantique l’exige (Conditions)

    être tolérante là où la V1 ne fait que décrire (Indicator)

    garantir un graphe cohérent, exploitable et extensible

La V1 décrit une stratégie.
Elle ne l’exécute pas.

