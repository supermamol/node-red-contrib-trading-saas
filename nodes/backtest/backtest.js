module.exports = function (RED) {
  function TradingBacktest(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      node.log("AST received:");
      node.log(JSON.stringify(msg.ast, null, 2));

      // plus tard :
      // POST /backtest/run
    });
  }
  RED.nodes.registerType("trading-backtest", TradingBacktest);
};
