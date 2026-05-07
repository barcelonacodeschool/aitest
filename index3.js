require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiRoute = require('./routes/aiRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/ai', aiRoute);

async function connectAndStart() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/ai_chat_db');
        console.log('Connected to MongoDB');
        app.listen(4000, () => console.log('Server running on port 4000'));
    } catch (err) {
        console.error('Could not connect to MongoDB:', err);
    }
}

connectAndStart();