import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProjectDescription(title: string, techStack: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional software portfolio writer. 
      Generate a professional and engaging "full description" and a catchy "short description" for a project titled "${title}" 
      built with ${techStack.join(", ")}. 
      Return the output as a JSON object with keys "short" and "full". 
      Make the short description around 20 words and the full description around 100 words.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
}

export async function askAnilAI(question: string, context: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are Anil Chauhan's professional AI assistant. 
        Your goal is to answer questions about Anil's background, skills, and projects based on the provided context.
        Anil's Context: ${JSON.stringify(context)}.
        Be professional, helpful, and concise. If you don't know something, say you'll pass the message to Anil.
        Format your response in simple markdown.`
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm sorry, I'm having a bit of trouble connecting to my brain right now. Please try again later!";
  }
}
