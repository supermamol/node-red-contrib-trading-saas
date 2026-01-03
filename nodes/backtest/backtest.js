module.exports = function (RED) {
  "use strict";

  function BacktestNode(config) {
    RED.nodes.createNode(this, config);

    const node = this;

    // AST généré côté éditeur (persisté dans flow.json)
    node.ast = config.ast || null;

    node.on("input", function (msg, send, done) {
      // Compat Node-RED < 1.0
      send = send || function () { node.send.apply(node, arguments); };

      // Si aucun AST n’est défini
      if (!node.ast) {
        node.warn("Backtest exécuté sans AST");
        msg.payload = {
          status: "error",
          message: "AST manquant"
        };
        send(msg);
        if (done) done();
        return;
      }

      // 👉 Ici : logique métier future
      // Pour l’instant on expose simplement l’AST
      msg.payload = {
        status: "ok",
        ast: node.ast
      };

      send(msg);
      if (done) done();
    });

    node.on("close", function () {
      // nettoyage si nécessaire
    });
  }

  RED.nodes.registerType("backtest", BacktestNode);
};
