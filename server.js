const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({limit: '50mb'})); // Increased limit for base64 images
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Vineyard Tracker API is running' });
});

// AI Detection endpoint - proxies requests to OpenAI
app.post('/api/detect-rows', async (req, res) => {
    try {
        const { image } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }
        
        // Check if API key is configured
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'OpenAI API key not configured on server. Please set OPENAI_API_KEY environment variable.' 
            });
        }
        
        console.log('Processing AI detection request...');
        
        // Call OpenAI Vision API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Analyze this vineyard satellite/aerial image and identify the vine rows. For each row you detect, provide the center point coordinates.

Instructions:
1. Identify all visible vine rows in the image
2. For each row, estimate a representative center point (x, y coordinates)
3. Return coordinates as percentages (0-100) of the image dimensions
4. Return your response as a JSON array in this exact format:
[{"x": 50.0, "y": 10.5}, {"x": 50.0, "y": 20.3}, ...]

Where x is the horizontal position (0=left, 100=right) and y is the vertical position (0=top, 100=bottom).
Only return the JSON array, no other text.`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: image
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            return res.status(response.status).json({ 
                error: errorData.error?.message || `OpenAI API error: ${response.status}` 
            });
        }
        
        const data = await response.json();
        console.log('AI detection completed successfully');
        
        // Return the response to the client
        res.json(data);
        
    } catch (error) {
        console.error('Error in detect-rows endpoint:', error);
        res.status(500).json({ 
            error: error.message || 'Internal server error' 
        });
    }
});

// Serve index.html for all other routes (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🍇 Vineyard Tracker server running on http://localhost:${PORT}`);
    console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
