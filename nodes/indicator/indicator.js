module.exports = function (RED) {
  function IndicatorNode(config) {
    RED.nodes.createNode(this, config);

    this.on("input", function (msg, send, done) {
      msg.indicators = msg.indicators || [];

      msg.indicators.push({
        kind: config.kind,
        period: config.period,
        name: config.name || null
      });

      send(msg);
      if (done) done();
    });
  }

  RED.nodes.registerType("indicator", IndicatorNode);
};
