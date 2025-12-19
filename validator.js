"use strict";

/**
 * Trading DSL — Validation AU DEPLOY (FULL ONLY)
 */

/* ===================== DSL DEFINITION ===================== */

const DSL_BY_TYPE = {
  "trading-ticker": {
    outputType: "price"
  },
  "trading-indicator": {
    inputTypes: ["price"],
    outputType: "series"
  },
  "trading-backtest": {
    inputTypes: ["series", "signal"]
  }
};

/* ===================== HELPERS ===================== */

function extractNodes(payload) {
  const nodes =
    Array.isArray(payload) ? payload :
    Array.isArray(payload?.flows) ? payload.flows :
    [];

  return nodes.filter(n =>
    n &&
    n.id &&
    n.type &&
    n.type !== "tab" &&
    !n.type.startsWith("subflow:")
  );
}

/**
 * ⚠️ TOUTE la logique métier est ici
 */
function validateWiring(nodes) {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const errors = [];

  for (const src of nodes) {
    const srcDsl = DSL_BY_TYPE[src.type];
    if (!srcDsl?.outputType) continue;

    const wires = Array.isArray(src.wires) ? src.wires : [];

    for (const targets of wires) {
      for (const tgtId of targets) {
        const tgt = byId.get(tgtId);
        if (!tgt) continue;

        const tgtDsl = DSL_BY_TYPE[tgt.type];
        if (!tgtDsl?.inputTypes) continue;

        if (!tgtDsl.inputTypes.includes(srcDsl.outputType)) {
          errors.push({
            fromId: src.id,
            toId: tgt.id,
            fromType: src.type,
            toType: tgt.type,
            fromLabel: src.name || src.symbol || src.type,
            toLabel: tgt.name || tgt.symbol || tgt.type,
            outputType: srcDsl.outputType,
            inputTypes: tgtDsl.inputTypes
          });
        }
      }
    }
  }

  return errors;
}

/* ===================== MIDDLEWARE ===================== */

function middleware(req, res, next) {

  const isDeploy =
    (req.method === "POST" || req.method === "PUT") &&
    (req.path === "/flows" || req.path.startsWith("/flows/"));

  if (!isDeploy) return next();

  console.log("🚨 Trading DSL middleware HIT POST /flows");

  const nodes = extractNodes(req.body);

  // Cas fréquent Node-RED : aucun graphe transmis
  if (nodes.length === 0) {
    console.log("⚠️ Trading DSL: no graph received, validation skipped");
    return next();
  }

  const errors = validateWiring(nodes);

  if (errors.length > 0) {

    // Message HUMAIN lisible par l’utilisateur
    const lines = errors.map(e =>
      `• ${e.fromLabel} → ${e.toLabel} : « ${e.outputType} » interdit (attendu : ${e.inputTypes.join(", ")})`
    );

    console.warn("[Trading DSL] invalid wiring", errors);

    return res
      .status(400)
      .type("text/plain")
      .send(
        "❌ Trading DSL : déploiement refusé\n" +
        lines.join("\n")
      );
  }

  return next();
}

module.exports = { middleware };
