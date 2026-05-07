require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const Message = require('../models/MessageModelGemini');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = 'You are a helpful assistant. Be friendly and concise.';
const HISTORY_LIMIT = 20;

async function chat(req, res) {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'message and sessionId are required' });
        }

        // === STEP 1: SAVE the user's message to MongoDB ===
        await Message.create({ sessionId, role: 'user', content: message });

        // === STEP 2: RETRIEVE the last N messages from MongoDB ===
        const history = await Message.find({ sessionId })
            .sort({ timestamp: -1 })
            .limit(HISTORY_LIMIT);

            history.reverse();

        // === STEP 3: ASSEMBLE the conversation array the AI API expects ===
        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));

        // === STEP 4: INJECT into the Gemini API call ===
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            systemInstruction: SYSTEM_PROMPT,
            contents: contents,
        });

        const replyText = response.text;

        // === STEP 5: SAVE the AI's reply to MongoDB ===
        await Message.create({ sessionId, role: 'model', content: replyText });

        res.json({ reply: replyText });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI request failed' });
    }
}

module.exports = { chat };