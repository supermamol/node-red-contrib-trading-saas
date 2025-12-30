/**
 * Trading Guard — Editor Plugin
 * Bloque certaines connexions de nodes AVANT deploy
 * Node-RED v4.1.2
 */
 alert("TRADING GUARD LOADED");
 console.log("🛡️ [Trading Guard] editor plugin loaded");
 
 (function () {
    // 🔎 Preuve absolue de chargement
    console.log("🛡️ [Trading Guard] editor plugin loaded");
  
    // Sécurité : vérifier l’existence de l’API editor
    if (!RED || !RED.view || !RED.view.addLink) {
      console.warn("🛡️ [Trading Guard] RED.view.addLink not found");
      return;
    }
  
    // Éviter le double monkey‑patch
    if (RED.view.addLink.__trading_guarded) {
      console.warn("🛡️ [Trading Guard] already guarded");
      return;
    }
  
    const originalAddLink = RED.view.addLink;
  
    /**
     * Règle métier centrale
     * Retourne true si la connexion est autorisée
     */
    function isAllowedLink(srcNode, tgtNode) {
      // Exemple strict basé sur DSL
      if (!srcNode?.dsl || !tgtNode?.dsl) {
        return false;
      }
  
      const outType = srcNode.dsl.outputType;
      const inTypes = tgtNode.dsl.inputTypes || [];
  
      return inTypes.includes(outType);
    }
  
    // Monkey‑patch officiel
    RED.view.addLink = function (a, b) {
      try {
        // Compatibilité signatures selon versions
        const source = b ? a : a?.source;
        const target = b ? b : a?.target;
  
        const srcNode = RED.nodes.node(source?.node);
        const tgtNode = RED.nodes.node(target?.node);
  
        if (!isAllowedLink(srcNode, tgtNode)) {
          RED.notify(
            `❌ Connexion interdite (${srcNode?.dsl?.outputType ?? "?"} → ${(tgtNode?.dsl?.inputTypes || []).join(", ")})`,
            "error"
          );
          return false; // ⛔ blocage immédiat
        }
      } catch (err) {
        console.warn("🛡️ [Trading Guard] link guard error", err);
        return false;
      }
  
      // Autorisé → comportement normal
      return originalAddLink.apply(this, arguments);
    };
  
    // Marqueur de sécurité
    RED.view.addLink.__trading_guarded = true;
  
    console.log("✅ [Trading Guard] link guard enabled");
  })();
  