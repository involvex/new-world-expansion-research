import type { Source } from '../types';

export const researchAeternum = async (prompt: string) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from the server.');
    }

    const { text, sources } = await response.json();
    return { text, sources: sources as Source[] };

  } catch (error) {
    console.error("Error calling backend API:", error);
    throw new Error("Failed to get response from the server.");
  }
};