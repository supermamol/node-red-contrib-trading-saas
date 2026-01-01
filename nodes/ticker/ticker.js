module.exports = function (RED) {
  function TickerNode(config) {
    RED.nodes.createNode(this, config);

    this.on("input", function (msg, send, done) {
      msg.market = {
        symbol: config.symbol,
        timeframe: config.timeframe,
        name: config.name || null
      };

      send(msg);
      if (done) done();
    });
  }

  RED.nodes.registerType("ticker", TickerNode);
};
