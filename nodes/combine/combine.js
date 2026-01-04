module.exports = function (RED) {
  function CombineNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.method = config.method || "and";

    // État interne
    let hasA = false;
    let hasB = false;
    let valA;
    let valB;

    node.on("input", function (msg, send, done) {
      // 🔒 Validation stricte de la source
      const src = msg.source;
      if (src !== "A" && src !== "B") {
        node.error(
          "Combine expects msg.source = 'A' or 'B'",
          msg
        );
        if (done) done();
        return;
      }

      // 🔒 Mémorisation explicite
      if (src === "A") {
        valA = msg.payload;
        hasA = true;
      } else {
        valB = msg.payload;
        hasB = true;
      }

      // ⏸️ Tant que les deux sources ne sont pas définies
      if (!hasA || !hasB) {
        if (done) done();
        return;
      }

      // ✅ Combinaison
      let result;
      try {
        switch (node.method) {
          case "and":
            result = Boolean(valA) && Boolean(valB);
            break;
          case "or":
            result = Boolean(valA) || Boolean(valB);
            break;
          case "avg":
            result = (Number(valA) + Number(valB)) / 2;
            break;
          case "min":
            result = Math.min(Number(valA), Number(valB));
            break;
          case "max":
            result = Math.max(Number(valA), Number(valB));
            break;
          default:
            throw new Error(`Unknown combine method: ${node.method}`);
        }
      } catch (err) {
        node.error(err.message, msg);
        if (done) done();
        return;
      }

      // 📤 Émission explicite
      send({
        payload: {
          type: "combined",
          method: node.method,
          A: valA,
          B: valB,
          value: result
        }
      });

      if (done) done();
    });
  }

  RED.nodes.registerType("combine", CombineNode);
};
