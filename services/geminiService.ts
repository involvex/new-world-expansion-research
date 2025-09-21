import type { Source } from "../types";

export const researchAeternum = async ({
  query,
  apiKey,
}: {
  query: string;
  apiKey: string;
}) => {
  try {
    const response = await fetch("http://localhost:3001/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey, // Pass API key in headers
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to get response from the server.",
      );
    }

    const { text, sources } = await response.json();
    return { text, sources: sources as Source[] };
  } catch (error) {
    console.error("Error calling backend API:", error);
    throw new Error("Failed to get response from the server.");
  }
};
