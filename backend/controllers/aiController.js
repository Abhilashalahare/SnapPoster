import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateLayout = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // This forces Gemini to ONLY output pure JSON, no conversational text
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemInstruction = `You are a professional graphic design assistant. 
    The canvas is 800px wide and 600px high.
    Based on the user's prompt, generate a layout returning ONLY a JSON array of Fabric.js objects.
    
    Supported types: "i-text" (for text), "rect" (for shapes), "circle".
    Use hex colors.
    
    Example array format:
    [
      { "type": "rect", "left": 0, "top": 0, "width": 800, "height": 600, "fill": "#1a1a1a" },
      { "type": "i-text", "text": "NEON NIGHTS", "left": 200, "top": 100, "fontSize": 64, "fill": "#ff00ff", "fontFamily": "Arial", "fontWeight": "bold" }
    ]`;

    const fullPrompt = `${systemInstruction}\n\nUser Prompt: Create a poster layout for: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const textResponse = result.response.text();

    // Safely parse the strict JSON
    let layoutObjects = JSON.parse(textResponse);
    
    // Safety check: If Gemini wrapped the array in an object (e.g., { objects: [...] }), extract it
    if (!Array.isArray(layoutObjects) && layoutObjects.objects) {
      layoutObjects = layoutObjects.objects;
    }

    const fabricJSON = {
      version: "5.3.0",
      objects: layoutObjects,
      background: "#ffffff"
    };

    res.status(200).json(fabricJSON);
  } catch (error) {
    console.error("Gemini AI Generation Error:", error);
    res.status(500).json({ message: 'Failed to generate layout.' });
  }
};