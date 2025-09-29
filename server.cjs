const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-API-Key", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());

const systemInstruction = `You are an expert researcher and a hardcore MMORPG gamer advising a maximized, end-game New World player. Your goal is to provide advanced, actionable tips for the upcoming 'Aeternum' expansion, based on the absolute latest information available.

**ASSUME THE PLAYER IS AT PEAK END-GAME:**
*   Completed all main story quests.
*   Maxed all trade skills and weapon masteries.
*   Possesses top-tier, best-in-slot gear.

**YOUR ADVICE MUST BE ADVANCED AND NUANCED. FOCUS ON:**
*   Pre-farming specific legendary or hard-to-obtain materials that will be critical for new recipes or upgrades.
*   Theory-crafting new builds based on announced changes to weapons, perks, or the introduction of new artifacts.
*   Advanced economic strategies for the new expansion, such as market manipulation or identifying new high-value items.
*   Strategies for day-one progression in new end-game systems (e.g., new expeditions, raids, PvP modes).

**DO NOT RECOMMEND THE FOLLOWING:**
*   **Outdated/Removed Mechanics:** Absolutely do not mention Repair Kits, as they have been removed from the game for a long time. Do not reference any other deprecated systems.
*   **Basic Activities:** Do not suggest finishing quests, leveling skills, or farming basic, easily obtainable resources like Azoth or Azoth Salt. The player is far beyond this.
*   **Generic Advice:** Avoid vague tips. Provide specific, data-driven recommendations.

Synthesize findings from reputable, up-to-date sources like recent YouTube videos from top New World creators, nwdb.info, and nw-buddy.de. Format your response using clear markdown with distinct sections or bullet points for easy parsing.`;

app.post("/api/gemini", async (req, res) => {
  try {
    const { query } = req.body;
    const apiKey = req.headers["x-api-key"];

    if (!query) {
      throw new Error("Query is required");
    }

    if (!apiKey) {
      throw new Error("API key is required");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();
    const sources =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(
        (chunk) => {
          const webChunk = chunk;
          return !!(
            webChunk.web &&
            typeof webChunk.web.uri === "string" &&
            typeof webChunk.web.title === "string"
          );
        },
      ) || [];

    res.json({ text, sources });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Tradeskill Calculator API endpoint
app.get("/api/tradeskills", async (req, res) => {
  try {
    // Import the tradeskill service dynamically
    const { calculateTradeskillRequirements } = await import("./services/tradeskillService.js");
    const calculation = calculateTradeskillRequirements();
    res.json(calculation);
  } catch (error) {
    console.error("Error calculating tradeskill requirements:", error);
    res.status(500).json({ error: "Failed to calculate tradeskill requirements" });
  }
});

app.get("/api/tradeskills/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { getTradeskillByName } = await import("./services/tradeskillService.js");
    const tradeskill = getTradeskillByName(name);
    
    if (!tradeskill) {
      return res.status(404).json({ error: "Tradeskill not found" });
    }
    
    res.json(tradeskill);
  } catch (error) {
    console.error("Error getting tradeskill:", error);
    res.status(500).json({ error: "Failed to get tradeskill data" });
  }
});

module.exports = app;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  if (process.send && process.env.NODE_ENV !== "test") {
    process.send("backend-ready");
  }
});

module.exports = app;
