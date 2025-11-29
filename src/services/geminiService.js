import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Corrección: usar import.meta.env para Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenerativeAI(API_KEY);

export const generatePixelSprite = async (prompt) => {
  if (!API_KEY) {
    throw new Error("❌ API Key missing. Add VITE_GEMINI_API_KEY to .env file");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate sprite");
  }
};