module.exports = function (RED) {
  function TradingBacktest(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      node.log("AST reçu pour backtest");
      node.send(msg);
    });
  }

  RED.nodes.registerType("trading-backtest", TradingBacktest);
};
