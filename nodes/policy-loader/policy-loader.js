module.exports = function (RED) {

  function PolicyLoaderNode(config) {
    RED.nodes.createNode(this, config);
    this.status({
      fill: "grey",
      shape: "ring",
      text: "editor-only"
    });
  }
  
  RED.nodes.registerType("policy-loader", PolicyLoaderNode);

};
