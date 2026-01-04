AST V1 — Spécification Officielle
Langage déclaratif de stratégies de trading (POC)
1. Objectif

Ce document définit la spécification officielle de l’AST V1 (Abstract Syntax Tree) utilisé pour décrire des stratégies de trading sous forme déclarative, non linéaire et orientée graphe.

La V1 est conçue comme un POC structurant :
minimale, mais suffisamment expressive pour révéler les vrais problèmes du trading réel.

    Principe clé
    La V1 décrit une stratégie. La V2 l’exécutera.

2. Portée et intentions
2.1 Objectifs de l’AST V1

L’AST V1 vise à :

    représenter fidèlement des stratégies réelles

    casser les hypothèses implicites de linéarité (pipeline)

    permettre des graphes complexes (branches, convergences, multi‑sources)

    rester strictement déclaratif

2.2 Hors périmètre explicite

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

    potentiellement cyclique (au sens déclaratif)

Ce n’est :

    ni un pipeline

    ni une liste ordonnée

    ni un graphe d’exécution

6. Non‑linéarité assumée

La non‑linéarité est intrinsèque aux stratégies de trading réelles.
Cas supportés nativement

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

Structure minimale :

    version

    rootBacktestId

    nodes (map de nodes)

    links (liste de liens)

L’ordre des clés n’a aucune signification.
7.2 Identité des nodes

Chaque node est identifié par un node_id :

    unique dans l’AST

    librement choisi

    sans sémantique fonctionnelle

Il sert uniquement à exprimer la structure.
7.3 Structure générale d’un node

Un node contient :

    id (obligatoire)

    type (obligatoire)

    params (obligatoire, mais libre en V1)

    ports (optionnel)

7.4 Sémantique de inputs

Le champ inputs décrit des dépendances logiques.

Il ne représente jamais :

    un ordre d’évaluation

    une séquence de calcul

    une exécution implicite

Conséquences :

    plusieurs parents autorisés

    réutilisation de nodes possible

    graphes non linéaires ou arborescents

7.5 Absence d’ordre et de résolution

La V1 :

    ne définit aucun ordre temporel

    ne résout aucun graphe

    n’évalue aucune condition

Les cycles sont autorisés à titre déclaratif uniquement.

    Principe clé
    Un node décrit ce dont il dépend, pas quand ni comment.

8. Types de nodes (V1)
8.1 Ticker

    source de marché

    aucun input

    plusieurs tickers autorisés

8.2 Indicator

    indicateur technique ou composite

    dépendances multiples autorisées

    aucune sémantique de calcul en V1

8.3 Conditions

    bifurcation structurelle

    une seule entrée

    sorties logiques multiples

    aucune évaluation

8.4 Combine (exception contrôlée)

    fusion explicite de deux signaux

    1 input physique

    2 sources logiques (A / B via msg.source)

    méthode métier explicite (and, or, avg, min, max)

    Exception volontaire à la policy générale,
    motivée par les limitations de l’éditeur Node‑RED.

8.5 Backtest

    node terminal

    sérialise l’AST

    n’exécute rien

9. Validation et policies (V1)

La validité du graphe est garantie avant exécution, directement dans l’éditeur.
9.1 Policy globale

Whitelist stricte des connexions autorisées :

ticker → indicator
indicator → indicator | conditions | backtest
conditions → backtest

Toute connexion interdite est supprimée immédiatement.
9.2 Policy locale — Conditions

    une seule connexion entrante autorisée

    toute tentative supplémentaire est bloquée

9.3 Exception Combine

    1 input physique

    exactement 2 branches entrantes

    sources distinctes

    validation structurelle éditeur

    validation sémantique runtime

10. Frontière V1 / V2
V1	V2
Déclaratif	Exécution
Graphe	DAG / pipeline
Structure	Scheduling
AST	Plan d’exécution

    L’AST décrit le “quoi”.
    Le plan d’exécution décide du “comment”.

11. Principe directeur final

    Si on ne peut pas le lire dans le graphe,
    alors le moteur n’a pas le droit de le faire.

Statut

AST V1 — POC structurant
Exécution hors périmètre