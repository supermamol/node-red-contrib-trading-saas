module.exports = function (RED) {
  function TradingIndicator(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      msg.ast = {
        type: "indicator",
        name: "EMA",
        params: {
          length: config.length,
          source: "close"
        },
        input: msg.ast
      };
      node.send(msg);
    });
  }

  RED.nodes.registerType("trading-indicator", TradingIndicator);
};
