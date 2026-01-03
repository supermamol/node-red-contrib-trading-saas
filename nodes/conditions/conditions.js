module.exports = function (RED) {
  function ConditionsNode(config) {
      RED.nodes.createNode(this, config);
      const node = this;

      node.rules = config.rules || [];
      node.outputs = config.outputs || 1;

      node.on("input", function (msg, send, done) {
          msg = msg || {};
          msg.ast = msg.ast || {};
          msg.ast.nodes = msg.ast.nodes || {};

          msg.ast.nodes[node.id] = {
              type: "conditions",
              rules: node.rules.map((r, i) => ({
                  port: i,
                  operator: r.operator,
                  value: r.value,
                  label: r.label
              }))
          };

          const out = new Array(node.outputs).fill(msg);
          send(out);
          if (done) done();
      });
  }

  RED.nodes.registerType("conditions", ConditionsNode);
};
