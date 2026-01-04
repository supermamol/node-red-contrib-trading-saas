module.exports = function (RED) {
    function ResampleNode(config) {
      RED.nodes.createNode(this, config);
      const node = this;
  
      node.from = config.from;
      node.to = config.to;
  
      node.on("input", function (msg, send, done) {
        if (!msg.payload) {
          node.error("No payload to resample");
          return;
        }
  
        // Le moteur réel fera l’agrégation OHLC
        msg.payload = {
          type: "resampled",
          from: node.from,
          to: node.to,
          data: msg.payload
        };
  
        send(msg);
        if (done) done();
      });
    }
  
    RED.nodes.registerType("resample", ResampleNode);
  };
  