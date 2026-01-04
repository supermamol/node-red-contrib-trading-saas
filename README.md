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


-------------------------------------------------------------


CONTRAT AST V1 – JSON

    META

    version (string) : "1.0"

    rootBacktestId (string) : id du node backtest racine

    nodes (object map) : clé = nodeId, valeur = NodeSpec

    links (array) : liste de LinkSpec

    errors (array, optionnel) : si présent et non vide, nodes/links peuvent être vides et l’AST est considéré “non exploitable”

    NODE SPEC

Un node dans l’AST est décrit par :

    id (string) : id Node-RED

    type (string) : "ticker" | "indicator" | "conditions" | "backtest"

    name (string, optionnel)

    params (object) : paramètres “propres” au node (V1 : libre, mais stable)

    ports (object, optionnel) :

        in (number | "N") : nombre d’entrées

        out (number) : nombre de sorties

        outLabels (array of string, optionnel) : labels des sorties (utile pour conditions)

    LINK SPEC

Un lien dans l’AST est décrit par :

    sourceId (string)

    sourcePort (number) : index du port source (0..)

    targetId (string)

    targetPort (number) : index du port target (0..)

SCHEMA JSON (Draft 2020-12)

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://trading-saas.local/schemas/ast-v1.json",
  "title": "Trading SaaS AST V1",
  "type": "object",
  "additionalProperties": false,
  "required": ["version", "rootBacktestId", "nodes", "links"],
  "properties": {
    "version": { "type": "string", "const": "1.0" },
    "rootBacktestId": { "type": "string", "minLength": 1 },

    "nodes": {
      "type": "object",
      "additionalProperties": { "$ref": "#/$defs/NodeSpec" }
    },

    "links": {
      "type": "array",
      "items": { "$ref": "#/$defs/LinkSpec" }
    },

    "errors": {
      "type": "array",
      "items": { "type": "string" }
    }
  },

  "$defs": {
    "NodeType": {
      "type": "string",
      "enum": ["ticker", "indicator", "conditions", "backtest"]
    },

    "PortsSpec": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "in": { "oneOf": [{ "type": "integer", "minimum": 0 }, { "type": "string", "const": "N" }] },
        "out": { "type": "integer", "minimum": 0 },
        "outLabels": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },

    "NodeSpec": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "type", "params"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "type": { "$ref": "#/$defs/NodeType" },
        "name": { "type": "string" },
        "params": { "type": "object" },
        "ports": { "$ref": "#/$defs/PortsSpec" }
      }
    },

    "LinkSpec": {
      "type": "object",
      "additionalProperties": false,
      "required": ["sourceId", "sourcePort", "targetId", "targetPort"],
      "properties": {
        "sourceId": { "type": "string", "minLength": 1 },
        "sourcePort": { "type": "integer", "minimum": 0 },
        "targetId": { "type": "string", "minLength": 1 },
        "targetPort": { "type": "integer", "minimum": 0 }
      }
    }
  }
}

CONTRAINTES “METIER” V1 (hors JSON Schema, à appliquer dans le code)

Ces règles sont la validation minimale dont on a parlé :

A) Sous-graphe pris en compte

    l’AST ne contient que les nodes atteignables en remontant depuis rootBacktestId.

B) Condition de validité minimale (bloquante)

    il doit exister au moins un chemin : ticker -> ... -> backtest

    équivalent simple : nodes contient au moins 1 node type === "ticker" (dans le sous-graphe)

C) Cohérence de base

    rootBacktestId doit exister dans nodes et être de type backtest

    chaque LinkSpec doit référencer des sourceId/targetId présents dans nodes

EXEMPLE MINIMAL VALIDE

{
  "version": "1.0",
  "rootBacktestId": "bt1",
  "nodes": {
    "t1": { "id": "t1", "type": "ticker", "name": "EURUSD", "params": { "symbol": "EURUSD" }, "ports": { "in": 0, "out": 1 } },
    "bt1": { "id": "bt1", "type": "backtest", "name": "BT", "params": {}, "ports": { "in": "N", "out": 0 } }
  },
  "links": [
    { "sourceId": "t1", "sourcePort": 0, "targetId": "bt1", "targetPort": 0 }
  ]
}

EXEMPLE INVALID (pas de ticker)

{
  "version": "1.0",
  "rootBacktestId": "bt1",
  "nodes": {
    "bt1": { "id": "bt1", "type": "backtest", "params": {} }
  },
  "links": [],
  "errors": ["Aucun ticker en source du backtest"]
}


🧠 Architecture, AST et Plan d’Exécution

Ce projet repose sur un principe fondamental :

    Le moteur ne doit jamais deviner l’intention de l’utilisateur.
    Tout comportement susceptible d’influencer le résultat doit être explicite dans le graphe.

Cette section décrit :

    la différence entre graphe Node‑RED, AST et plan d’exécution

    la gestion du temps (timeframes)

    la gestion des fusions de signaux

    les règles de validation garantissant un moteur déterministe et explicable

1. Graphe Node‑RED, AST et Plan d’Exécution
1.1 Graphe Node‑RED

Le graphe Node‑RED est :

    visuel

    descriptif

    libre (branches, cycles, multi‑sources)

    orienté conception

Il exprime l’intention utilisateur, pas l’exécution.
1.2 AST (Abstract Syntax Tree)

Le graphe Node‑RED est transformé en un AST interne.

L’AST est :

    descriptif

    structurel

    indépendant de Node‑RED

    sérialisable (JSON)

    non exécutable

    ⚠️ L’AST peut contenir des structures non exécutables (branches, cycles).

1.3 Plan d’Exécution

Le plan d’exécution est généré à partir de l’AST.

Il est :

    déterministe

    ordonné

    sans graphe

    exécutable

    indépendant de Node‑RED

👉 L’AST décrit le “quoi”.
👉 Le plan d’exécution décide du “comment”.
2. Principe directeur : pas de comportements implicites

    Si un comportement n’est pas visible dans le graphe,
    alors le moteur n’a pas le droit de le faire.

Conséquences :

    pas de resampling implicite

    pas d’alignement temporel automatique

    pas de fusion silencieuse de signaux

    pas de choix heuristiques dans le moteur

Toute ambiguïté est une erreur de conception ou de compilation.
3. Gestion du temps et des Timeframes
3.1 Timeframes supportés

Le moteur supporte un ensemble fini de timeframes discrets, par exemple :

1m, 5m, 10m, 15m, 30m,
1h, 2h, 4h,
1d, 1w

Toute donnée, indicateur ou transformation doit utiliser un timeframe supporté.
3.2 Règle fondamentale

    Un opérateur métier ne consomme que des flux ayant le même timeframe.

Si plusieurs timeframes sont impliqués, ils doivent être explicitement alignés.
4. Node Resample
4.1 Rôle

Le node Resample permet de changer le timeframe d’une série unique par agrégation.

    1 input → 1 output

    transformation rapide → lent uniquement

    méthode standard (ex : OHLC)

👉 Resample ne combine jamais plusieurs sources.
4.2 Exemple

Ticker (10m) → Resample (10m → 1h) → Indicator

4.3 Règles

    Resample est toujours explicite

    aucun resampling implicite n’est autorisé

    resampling lent → rapide est interdit

    toute tentative d’alignement automatique est une erreur

5. Fusion de signaux et node Combine
5.1 Rôle

Le node Combine permet de fusionner plusieurs signaux déjà alignés temporellement en un signal unique, selon une règle métier explicite.

Il est :

    optionnel

    sémantique

    explicite

5.2 Combine implicite vs explicite

Combine node

Le node Combine fusionne deux signaux logiques A et B.

Contrairement à d’autres nodes, Combine utilise un seul input physique.
Les sources sont distinguées via msg.source.

Cette approche est une exception volontaire à la policy “1 input = 1 source”,
motivée par :

    les limitations de l’éditeur Node‑RED

    la volonté d’un comportement strict et simple

La validation impose exactement 2 sources distinctes.

Combine explicite

Un node Combine est requis lorsque la méthode de fusion est un choix métier.

Exemple :

Signal A ─┐
          ├─ Combine (AND) ─ Conditions
Signal B ─┘

5.3 Méthodes supportées (V1)
Méthode	Type	Description
and	booléen	tous les signaux doivent être vrais
or	booléen	au moins un signal vrai
avg	numérique	moyenne arithmétique
min	numérique	minimum
max	numérique	maximum

    Ces méthodes sont :

        déterministes

        sans paramètre caché

        sans ambiguïté métier

5.4 Contraintes

    tous les inputs doivent avoir le même timeframe

    Combine ne modifie jamais le timeframe

    toute hétérogénéité temporelle doit être traitée avant, via Resample

6. Node Conditions
Rôle

Le node Conditions :

    accepte une seule entrée

    évalue un signal unique

    ne gère aucune logique multi‑sources

👉 Toute logique combinatoire doit être faite en amont, via Combine.
7. Gestion des cycles
7.1 À la conception

    les cycles structurels sont détectés

    un avertissement est affiché

    l’utilisateur est guidé

7.2 À la compilation

    toute boucle structurelle non qualifiée est interdite

    le plan d’exécution est refusé

    La boucle temporelle (bougie par bougie) est implicite et gérée par le moteur,
    mais elle n’est jamais représentée comme un cycle dans le plan.

8. Validation : double niveau
Niveau	Objectif
Conception	UX, pédagogie, feedback immédiat
Compilation	Sécurité, robustesse, refus strict

    Toute erreur métier doit être détectée le plus tôt possible,
    mais refusée le plus tard possible.

9. Résumé des règles clés

    aucun comportement implicite surprenant

    un problème = un node dédié

    temps → Resample

    fusion métier → Combine

    logique → Conditions

    ambiguïté → erreur

🧠 Philosophie finale

    Si on ne peut pas le lire dans le graphe,
    alors le moteur n’a pas le droit de le faire.


