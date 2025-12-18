module.exports = function (RED) {
  function TradingTicker(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function () {
      node.send({
        ast: {
          type: "source",
          source: "ticker",
          symbol: config.symbol,
          timeframe: config.timeframe
        }
      });
    });
  }
  RED.nodes.registerType("trading-ticker", TradingTicker);
};
