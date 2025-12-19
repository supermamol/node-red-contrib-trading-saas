(function () {
  const addLink = RED?.view?.addLink;
  if (!addLink) {
    console.warn("[DSL] RED.view.addLink not found");
    return;
  }

  // Supporte (source,target) OU (link) selon versions
  RED.view.addLink = function (a, b) {
    try {
      const source = b ? a : a?.source;
      const target = b ? b : a?.target;

      const srcNode = RED.nodes.node(source?.node);
      const tgtNode = RED.nodes.node(target?.node);

      if (srcNode?.dsl && tgtNode?.dsl) {
        const outType = srcNode.dsl.outputType;
        const inTypes = tgtNode.dsl.inputTypes || [];
        if (!inTypes.includes(outType)) {
          RED.notify(`❌ Connexion interdite (${outType} → ${inTypes.join(", ")})`, "error");
          return;
        }
      }
    } catch (e) {
      console.warn("[DSL] link guard error", e);
    }

    return addLink.apply(this, arguments);
  };

  console.log("✅ [DSL] link guard enabled");
})();
