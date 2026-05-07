require('dotenv').config();
const Message = require('../models/MessageModelOpenAI.js');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const SYSTEM_PROMPT = 'Every time you reply with a sarcastic joke before the actual answer to user message. Keep it short and funny.';
const HISTORY_LIMIT = 20;



async function createOpenAIReply(messages) {
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
}

async function chat(req, res) {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'message and sessionId are required' });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
        }

        await Message.create({ sessionId, role: 'user', content: message });

        const history = await Message.find({ sessionId })
            .sort({ timestamp: -1 })
            .limit(HISTORY_LIMIT);

            history.reverse();
            
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        ];

        const replyText = await createOpenAIReply(messages);

        await Message.create({ sessionId, role: 'assistant', content: replyText });

        res.json({ reply: replyText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI request failed' });
    }
}

module.exports = { chat };
