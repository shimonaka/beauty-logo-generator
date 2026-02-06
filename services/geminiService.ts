import { GoogleGenAI } from "@google/genai";
import { STYLE_PROMPTS, COLOR_PROMPTS } from '../constants';
import { FormData } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Using the PRO model for better text rendering and detail
const MODEL_NAME = 'gemini-3-pro-image-preview';

export const generateLogos = async (formData: FormData): Promise<{ base64: string; isJapaneseFallback: boolean }[]> => {
  const isJapanese = /[^\x01-\x7E]/.test(formData.storeName);
  const stylePrompt = STYLE_PROMPTS[formData.style];
  const colorPrompt = COLOR_PROMPTS[formData.color];

  let prompt = "";
  
  if (isJapanese) {
    // Fallback: Symbol only
    prompt = `A professional hair salon logo symbol (icon only, no text) in ${stylePrompt}, ${colorPrompt}. The symbol should be clean, scalable, and suitable for business use. Chromakey green background (#00FF00), no gradients on background.`;
  } else {
    // Normal: Include text
    prompt = `A professional hair salon logo featuring the text "${formData.storeName}" in ${stylePrompt}, ${colorPrompt}. The logo should be clean, scalable, and suitable for business use. Chromakey green background (#00FF00), no gradients on background.`;
  }

  // Generate 3 images in parallel
  // Note: Standard generateContent usually returns 1 candidate for image models unless we loop.
  // We will fire 3 requests to get 3 variations.
  
  const generateOne = async () => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      // Find image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      return null;
    }
  };

  const promises = [generateOne(), generateOne(), generateOne()];
  const results = await Promise.all(promises);

  return results
    .filter((res): res is string => res !== null)
    .map(base64 => ({
      base64,
      isJapaneseFallback: isJapanese
    }));
};
