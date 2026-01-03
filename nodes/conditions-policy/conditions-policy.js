module.exports = function (RED) {
    function ConditionsPolicyNode(config) {
      RED.nodes.createNode(this, config);
    }
    RED.nodes.registerType("conditions-policy", ConditionsPolicyNode);
  };
  