import { GoogleGenAI } from "@google/genai";
import { AnalysisType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImageWithGemini = async (file: File, type: AnalysisType): Promise<string> => {
  try {
    const base64Data = await fileToGenerativePart(file);
    
    let modelName = 'gemini-3-pro-preview'; // Default for complex analysis
    let prompt = '';

    if (type === AnalysisType.DETAILS) {
      modelName = 'gemini-3-pro-preview';
      prompt = `Analyze this image in detail. Describe the subject, the lighting, the angle, and the overall mood. 
      Format the output with bold headers for 'Subject', 'Lighting', and 'Mood'. Keep it concise but professional.`;
    } else if (type === AnalysisType.CAPTION) {
      modelName = 'gemini-2.5-flash'; // Flash is better for quick creative text tasks
      prompt = `Generate 3 creative, short, and engaging social media captions for this photo. 
      Include 3 relevant hashtags for each. Output just the captions as a bulleted list.`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze image. Please ensure your API key is valid.";
  }
};