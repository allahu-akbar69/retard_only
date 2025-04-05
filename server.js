const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Use environment variable for port (for Vercel)
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Use Gemini 2.0 Flash with v1beta
const GEMINI_MODEL = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// POST request to /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if the API key exists
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in environment variables' });
  }

  try {
    // Send the request to the Gemini API
    const geminiResponse = await axios.post(
      `${API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: userMessage }] }]
      }
    );

    // Check for valid response from Gemini API
    const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ reply }); // Send the response back to the frontend
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    // Send error response if there's an issue with the API request
    res.status(500).json({ error: 'Error connecting to Gemini API.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
