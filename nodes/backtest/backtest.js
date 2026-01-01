module.exports = function (RED) {
  function BacktestNode(config) {
    RED.nodes.createNode(this, config);

    this.active = config.active !== false;

    this.on("input", function (msg, send, done) {

      msg.backtest = {
        from: config.from,
        to: config.to,
        name: config.name || null
      };

      if (this.active) {
        this.log("Backtest AST:");
        this.log(JSON.stringify(msg, null, 2));
      }

      if (done) done();
    });
  }

  RED.nodes.registerType("backtest", BacktestNode);
};
