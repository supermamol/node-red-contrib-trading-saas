module.exports = function (RED) {
  function TradingCore(config) {
    RED.nodes.createNode(this, config);
  }

  RED.nodes.registerType("trading-core", TradingCore);
};
