module.exports = function (RED) {
    function TradingPolicyNode(config) {
      RED.nodes.createNode(this, config);
    }
    RED.nodes.registerType("trading-policy", TradingPolicyNode);
  };
  