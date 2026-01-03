"use strict";

module.exports = function (RED) {

  function BacktestNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.warn("[Backtest] runtime loaded");

    node.on("input", function (msg) {
      if (msg && msg._control === "toggle") {
        if (msg.enabled) {
          node.warn("[Backtest] activated");
        } else {
          node.warn("[Backtest] deactivated");
        }
      }
    });
  }

  RED.nodes.registerType("backtest", BacktestNode);
};
