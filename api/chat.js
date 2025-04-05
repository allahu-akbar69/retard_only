// const axios = require('axios');

// // Gemini API details
// const GEMINI_MODEL = 'gemini-2.0-flash';
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// module.exports = async (req, res) => {
//   if (req.method === 'POST') {
//     const userMessage = req.body.message;
//     const apiKey = process.env.GEMINI_API_KEY;

//     // Check if the API key exists
//     if (!apiKey) {
//       return res.status(500).json({ error: 'API key is missing in environment variables' });
//     }

//     try {
//       // Send the request to the Gemini API
//       const geminiResponse = await axios.post(
//         `${API_URL}?key=${apiKey}`,
//         {
//           contents: [{ parts: [{ text: userMessage }] }]
//         }
//       );

//       // Check for valid response from Gemini API
//       const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
//       res.json({ reply }); // Send the response back to the frontend
//     } catch (error) {
//       console.error("Gemini API Error:", error.response?.data || error.message);
//       // Send error response if there's an issue with the API request
//       res.status(500).json({ error: 'Error connecting to Gemini API.' });
//     }
//   } else {
//     // If the method is not POST, return 405 Method Not Allowed
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// };
// File: api/chat.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API key' });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  try {
    const response = await axios.post(
      `${API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: message }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response received.';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API request failed.' });
  }
}
