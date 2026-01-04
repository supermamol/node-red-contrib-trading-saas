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

AST global, vues AST par Backtest et génération du plan d’exécution

La stratégie est définie par un AST global unique, qui constitue la source de vérité structurelle du système.

Cet AST global :

    décrit l’intégralité de la stratégie,

    inclut tous les nodes, toutes les branches et tous les nodes Backtest,

    est indépendant de toute vue utilisateur ou sélection contextuelle,

    est le seul artefact utilisé pour la validation, la compilation et l’exécution.

Il n’existe qu’un seul AST réel par stratégie.
Vues AST contextuelles par Backtest

Afin de faciliter la compréhension et l’analyse individuelle des stratégies, l’interface permet d’afficher, pour chaque node Backtest, une vue AST restreinte à son propre chemin logique.

Lorsqu’un Backtest est sélectionné :

    l’onglet AST affiche un arbre partiel correspondant uniquement aux nodes et dépendances menant à ce Backtest,

    cette vue permet une lecture locale, pédagogique et focalisée,

    elle aide à raisonner sur un Backtest pris isolément.

Ces arbres AST “par Backtest” sont :

    des vues dérivées,

    calculées à partir de l’AST global,

    strictement en lecture seule.

⚠️ Ils n’ont aucune existence opérationnelle :

    ils ne sont jamais sérialisés comme AST exécutables,

    ils ne sont jamais utilisés pour générer un plan d’exécution,

    ils ne participent ni à la compilation, ni au runtime.

AST global comme étape intermédiaire incontournable

La génération et la validation de l’AST global constituent une étape intermédiaire obligatoire entre l’édition de la stratégie et toute exécution.

Le pipeline conceptuel est strictement le suivant :

    AST global

        unique

        complet

        indépendant des vues UI

    Validation structurelle

        cohérence du graphe

        règles métier

    Compilation

        transformation déterministe de l’AST global

    Plan d’exécution unique

        exécutable

        synchronisé

        indépendant de l’interface

    RUN

        exécution du plan

        streaming des résultats

Aucun plan d’exécution ne peut être généré :

    à partir d’un AST partiel,

    à partir d’une vue par Backtest,

    ou à partir d’un sous‑graphe dépendant de l’état de l’UI.

Séparation stricte entre vue et exécution

Cette architecture repose sur une séparation claire des responsabilités :
Élément	Rôle
AST global	Source de vérité de la stratégie
AST View (par Backtest)	Aide à la lecture et à la compréhension
Plan d’exécution	Artefact exécutable unique
RUN	Déclenchement de l’exécution
WebSocket	Canal d’observation des résultats

Les vues AST améliorent la lisibilité humaine,
mais l’exécution reste exclusivement fondée sur l’AST global.
Principe directeur

    L’utilisateur peut raisonner localement sur un Backtest via une vue AST dédiée,
    mais le moteur ne raisonne et n’exécute qu’à partir d’un AST global unique.


    ✅ Décision actée

👉 Le panel s’appelle “Strategies & Runs”
👉 Il expose la liste des backtests actifs d’une stratégie (AST)
👉 Ces backtests sont cliquables pour piloter leur affichage dans le panel TV Charts
1️⃣ Ce que représente “backtests actifs” (clarification nette)

Dans ce modèle :

    les backtests actifs sont :

        ceux capturés dans l’AST

        donc figés au moment de la génération de l’AST

    ils représentent :

        les terminaux observables du plan d’exécution

        pas des options dynamiques d’exécution

👉 Le panel ne modifie pas l’AST,
👉 il pilote uniquement l’observation.

C’est une distinction clé.
2️⃣ Rôle exact du panel Strategies & Runs
Pour une stratégie sélectionnée (AST)

Le panel affiche par exemple :

Strategy: ARTG – Breakout RSI
--------------------------------
☑ Backtest A (RSI > 70)
☑ Backtest B (RSI < 30)
☐ Backtest C (Trend filter)

    cette liste vient exclusivement de l’AST

    aucun calcul implicite

    aucune dépendance à Node‑RED

3️⃣ Interaction attendue (très importante)
Clic sur un backtest dans le panel

👉 Effet unique :

    affichage / dés‑affichage de la série correspondante

    dans le panel TV Charts

    sans relancer le RUN

    sans toucher au moteur

C’est donc :

    un toggle d’observation

    pas un toggle d’exécution

4️⃣ Implication côté Chart (lightweight‑charts / TV Charts)

Chaque backtest correspond à :

    une série dédiée

    avec :

        une couleur stable (issue du node backtest)

        un backtestId

Comportement attendu

    toggle ON :

        la série est visible

    toggle OFF :

        la série est masquée (pas détruite)

👉 Les données continuent éventuellement d’arriver,
👉 mais la vue décide quoi montrer.
5️⃣ Implication côté API (simple et propre)
L’API n’a RIEN de spécial à faire

    ❌ pas de endpoint “activate / deactivate backtest”

    ❌ pas de mutation d’AST

    ❌ pas de re‑génération de plan

Le panel :

    connaît les backtests actifs via :

GET /api/asts/{astId}

connaît les résultats via :

    WS /runs/{runId}

👉 Tout le pilotage est frontend.
6️⃣ Où vit l’état “affiché / masqué” ?

👉 Uniquement côté UI

Par exemple :

visibleBacktests = {
  btA: true,
  btB: true,
  btC: false
}

    état éphémère

    non persisté

    spécifique à la session / utilisateur

C’est exactement ce qu’on veut.


