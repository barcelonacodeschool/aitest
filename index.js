require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// randomjoke to get a random joke from https://api.chucknorris.io/jokes/random
app.get('/randomjoke', async (req, res) => {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        res.json({ joke: data.value });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch joke' });
    }
});

app.post('/ai/chatgemini', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'message is required' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            systemInstruction: "You are a comedian. Reply with one short joke based on the user's message",
            contents: message,
        });

        res.json({ reply: response.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI request failed' });
    }
});

app.post('/ai/chatopenai', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'message is required' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4.1-mini',
                messages: [
                    { role: 'system', content: "You are a comedian. Reply with one short joke based on the user's message" },
                    { role: 'user', content: message },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('OpenAI response data:', JSON.stringify(data, null, 2));
        const reply = data.choices?.[0]?.message?.content?.trim() || '';
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI request failed' });
    }
});



const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port', port));