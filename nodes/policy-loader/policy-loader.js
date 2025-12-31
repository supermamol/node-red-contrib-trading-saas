module.exports = function (RED) {
    function PolicyLoaderNode(config) {
      RED.nodes.createNode(this, config);
      // Aucun runtime volontairement
    }
  
    RED.nodes.registerType("trading-policy-loader", PolicyLoaderNode);
  };
