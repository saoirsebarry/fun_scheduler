// agentService.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use 'gemini-1.5-flash' for speed and low cost (Free tier)
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json" // FORCE JSON response
  }
});

const generateDiscovery = async (interest) => {
  try {
    // 1. Construct the prompt
    // We give it the current date so it suggests relevant things
    const today = new Date().toDateString();
    
    const prompt = `
      You are a hyper-local concierge agent for London, United Kingdom.
      Today is ${today}.
      
      The user is interested in: "${interest}".
      
      Find ONE specific and real activity/event/location fitting this vibe.
      
      Return a raw JSON object with these exact fields:
      - title: (String) Short, punchy title of the place or event.
      - description: (String) 2 sentences. Why is it cool? Mention a specific detail (e.g., "Best at sunset", "Try the house blend").
      - color: (String) Hex code matching the vibe. Use #0EA5E9 for chill/water, #F59E0B for adventure, #EC4899 for social/nightlife, #1E293B for intellectual.
      - icon: (String) A valid Ionicons name (e.g., "walk", "wine", "musical-notes", "camera", "restaurant", "star", "bicycle").
    `;

    // 2. Call the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Parse and Return
    const data = JSON.parse(text);
    return data;

  } catch (error) {
    console.error("AI Agent Error:", error);
    // Fallback if AI fails (prevents app crash)
    return {
      title: `${interest} Spot`,
      description: "The agent found a spot, but the signal was fuzzy. Check back soon!",
      color: "#94A3B8",
      icon: "search"
    };
  }
};

module.exports = { generateDiscovery };