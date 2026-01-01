module.exports = function (RED) {
    function ConditionNode(config) {
      RED.nodes.createNode(this, config);
  
      this.on("input", function (msg, send, done) {
        msg.conditions = msg.conditions || [];
  
        msg.conditions.push({
          operator: config.operator,
          value: config.value,
          name: config.name || null
        });
  
        send(msg);
        if (done) done();
      });
    }
  
    RED.nodes.registerType("condition", ConditionNode);
  };
  