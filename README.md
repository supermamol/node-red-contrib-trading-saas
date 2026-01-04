AST V1 — Spécification officielle
Langage déclaratif de stratégies de trading (POC)
1. Objectif

Ce document définit la spécification officielle de l’AST V1 (Abstract Syntax Tree) utilisé pour décrire des stratégies de trading sous une forme :

    déclarative

    non linéaire

    orientée graphe

L’AST V1 constitue un POC structurant :
il est volontairement minimal, mais suffisamment expressif pour exposer les véritables contraintes des stratégies de trading réelles.

    Principe clé
    La V1 décrit une stratégie. La V2 l’exécutera.

2. Portée et intentions
2.1 Objectifs de l’AST V1

L’AST V1 vise à :

    représenter fidèlement des stratégies de trading réelles

    casser les hypothèses implicites de linéarité (pipeline)

    autoriser des graphes complexes :

        branches

        convergences

        multi‑sources

    rester strictement déclaratif

2.2 Hors périmètre explicite

L’AST V1 ne couvre pas :

    l’exécution

    l’évaluation des conditions

    le calcul des indicateurs

    la résolution des dépendances

    l’optimisation

    le scheduling

3. Principe fondamental

Le graphe construit dans l’éditeur EST l’AST.

Il n’existe :

    aucune compilation intermédiaire implicite

    aucune transformation cachée

    aucune logique dérivée ou magique

Le node Backtest agit uniquement comme :

    observateur

    point de sérialisation

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

Il sert uniquement à exprimer la structure du graphe.
7.3 Structure générale d’un node

Un node contient :

    id (obligatoire)

    type (obligatoire)

    params (obligatoire, libre en V1)

    ports (optionnel)

7.4 Sémantique des inputs

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

    méthode métier explicite :

        and, or, avg, min, max

    Exception volontaire à la policy générale, motivée par les limitations de l’éditeur Node‑RED.

8.5 Backtest

    node terminal

    sérialise l’AST

    n’exécute rien

9. Validation et policies (V1)

La validité du graphe est garantie avant toute exécution, directement dans l’éditeur.
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

    validation structurelle dans l’éditeur

    validation sémantique au runtime

10. Frontière V1 / V2
V1	V2
Déclaratif	Exécution
Graphe	DAG / pipeline
Structure	Scheduling
AST	Plan d’exécution

    L’AST décrit le quoi.
    Le plan d’exécution décide du comment.

11. Principe directeur

    Si on ne peut pas le lire dans le graphe, alors le moteur n’a pas le droit de le faire.

12. AST global et vues dérivées
12.1 AST global — source de vérité

La stratégie est définie par un AST global unique, qui constitue la source de vérité structurelle du système.

Cet AST global :

    décrit l’intégralité de la stratégie

    inclut tous les nodes, toutes les branches et tous les Backtests

    est indépendant de toute vue utilisateur ou sélection contextuelle

    est le seul artefact utilisé pour :

        la validation

        la compilation

        l’exécution

    Il n’existe qu’un seul AST réel par stratégie.

12.2 Vues AST par Backtest

Afin de faciliter la compréhension et l’analyse locale :

    l’interface permet d’afficher, pour chaque Backtest, une vue AST restreinte

    cette vue correspond uniquement aux nodes et dépendances menant à ce Backtest

Ces vues :

    sont calculées à partir de l’AST global

    sont strictement en lecture seule

    n’ont aucune existence opérationnelle

⚠️ Elles ne sont jamais :

    sérialisées comme AST exécutables

    utilisées pour générer un plan d’exécution

    impliquées dans la compilation ou le runtime

13. AST global comme étape intermédiaire obligatoire

La génération et la validation de l’AST global constituent une étape intermédiaire incontournable entre l’édition et l’exécution.

Pipeline conceptuel strict :

    AST global unique et complet

    Validation structurelle et règles métier

    Compilation déterministe

    Plan d’exécution unique et exécutable

    RUN (exécution + streaming)

Aucun plan d’exécution ne peut être généré :

    à partir d’un AST partiel

    à partir d’une vue par Backtest

    à partir d’un sous‑graphe dépendant de l’état de l’UI

14. Séparation stricte vue / exécution
Élément	Rôle
AST global	Source de vérité
AST View (Backtest)	Lecture et compréhension
Plan d’exécution	Artefact exécutable
RUN	Déclenchement
WebSocket	Observation

    Les vues améliorent la lisibilité humaine.
    L’exécution repose exclusivement sur l’AST global.

15. Principe directeur final

    L’utilisateur peut raisonner localement via des vues,
    mais le moteur ne raisonne et n’exécute qu’à partir d’un AST global unique.

