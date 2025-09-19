import { GoogleGenAI } from "@google/genai";
import type { Source } from '../types';

const DEFAULT_API_KEY = import.meta.env.VITE_API_KEY as string;

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

export const researchAeternum = async (prompt: string, apiKey?: string) => {
  const key = apiKey || DEFAULT_API_KEY;
  if (!key) {
    throw new Error("API key is required. Please provide it via .env or input field.");
  }

  const ai = new GoogleGenAI({ apiKey: key });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: Source[] = groundingMetadata?.groundingChunks?.filter(
        (chunk: unknown): chunk is Source => {
          const c = chunk as { web?: { uri?: string; title?: string } };
          return !!(c.web && typeof c.web.uri === 'string' && typeof c.web.title === 'string');
        }
    ) || [];

    return { text, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};
