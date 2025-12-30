module.exports = function (RED) {
    console.log("🛡️ [Trading Guard] editor plugin loaded");

    // Sécurité : éviter double enregistrement
    if (RED.__tradingGuardInstalled) {
        console.warn("🛡️ [Trading Guard] already installed");
        return;
    }
    RED.__tradingGuardInstalled = true;

    RED.events.on("nodes:can-link", function (evt) {
        const src = evt.source;
        const dst = evt.target;
        if (!src || !dst) return;

        // RÈGLE 1 — trading-ticker → trading-backtest interdit
        if (
            src.type === "trading-ticker" &&
            dst.type === "trading-backtest"
        ) {
            evt.reject(
                "❌ Connexion interdite : trading-ticker → trading-backtest\n" +
                "Un backtest ne peut pas consommer un flux live."
            );
        }
    });

    console.log("✅ [Trading Guard] can-link guard active");
};
