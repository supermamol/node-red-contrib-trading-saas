module.exports = function (RED) {
  function PolicyLoaderNode(config) {
    RED.nodes.createNode(this, config);
  }

  RED.nodes.registerType("policy-loader", PolicyLoaderNode);
};
