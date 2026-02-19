import express from "express";

const app = express();
app.use(express.json());

// --- Rule-based fallback explanation (always works) ---
function explainRiskFallback({ farmName, rainfall, temperature, risk }) {
  const why = [];
  if (rainfall >= 30) why.push("rainfall has been high");
  else if (rainfall >= 15) why.push("rainfall has been moderate");
  else why.push("rainfall has been low");

  if (temperature >= 10 && temperature <= 20) why.push("temperatures are mild");
  else if (temperature < 5) why.push("temperatures are low");
  else if (temperature > 20) why.push("temperatures are warm");
  else why.push("temperatures are cool");

  return `Risk for ${farmName} is ${risk.toUpperCase()} because ${why.join(
    " and "
  )}. This indicator is based on simplified environmental thresholds (rainfall and temperature) and is intended to support discussion, not diagnose parasites or replace veterinary advice.`;
}

// POST /api/explain
app.post("/api/explain", async (req, res) => {
  const { farmName, rainfall, temperature, risk } = req.body || {};
  if (!farmName || rainfall === undefined || temperature === undefined || !risk) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // For Sprint 1: use fallback explanation (no external AI required)
  const text = explainRiskFallback({ farmName, rainfall, temperature, risk });
  return res.json({ explanation: text });
});

// POST /api/chat  (simple command + FAQ bot for Sprint 1)
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  const msg = (message || "").toLowerCase();

  // Simple intents (expand later)
  if (msg.includes("help")) {
    return res.json({
      reply:
        "Try: 'show high risk only', 'show all', 'reset view', 'zoom to leeds', or ask 'what does high mean?'",
      action: { type: "none" },
    });
  }

  if (msg.includes("high risk only") || msg.includes("show high")) {
    return res.json({
      reply: "Showing only HIGH risk farms.",
      action: { type: "filterRisk", value: "high" },
    });
  }

  if (msg.includes("show all")) {
    return res.json({
      reply: "Showing all farms.",
      action: { type: "filterRisk", value: "all" },
    });
  }

  if (msg.includes("reset")) {
    return res.json({
      reply: "Resetting map view to the UK.",
      action: { type: "resetView" },
    });
  }

  if (msg.includes("zoom to leeds")) {
    return res.json({
      reply: "Zooming to Leeds.",
      action: { type: "zoomTo", value: { lat: 53.8008, lng: -1.5491, zoom: 11 } },
    });
  }

  if (msg.includes("what does high mean") || msg.includes("what is high")) {
    return res.json({
      reply:
        "High risk means conditions are more favourable for parasite larvae survival (typically wetter and mild temperatures). It’s an indicator, not confirmation of parasites.",
      action: { type: "none" },
    });
  }

  return res.json({
    reply:
      "I can help with map actions and quick explanations. Type 'help' to see commands.",
    action: { type: "none" },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
