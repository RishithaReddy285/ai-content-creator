// AI helper wrapper
// Folder: server/src/utils/openai.js

const axios = require('axios');

function buildSummaryPrompt(content, length, language, tone) {
  return `You are a concise summarization assistant.

Content:
"""
${content}
"""

Produce:
1) A ${length} summary in ${language} with ${tone} tone.
2) A list of important keywords (5-12).
3) Return only valid JSON with keys: summary, keywords`;
}

function parseSummaryResponse(text) {
  let summary = '';
  let keywords = [];

  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const jsonText = jsonStart !== -1 && jsonEnd !== -1 ? text.slice(jsonStart, jsonEnd + 1) : text;
    const parsed = JSON.parse(jsonText);
    summary = parsed.summary || '';
    keywords = Array.isArray(parsed.keywords) ? parsed.keywords : [];
  } catch (err) {
    const parts = text.split('\n');
    summary = parts.slice(0, 6).join(' ');
    const kwLine = parts.find(line => /keyword/i.test(line));
    if (kwLine) {
      keywords = kwLine
        .split(':')
        .pop()
        .split(/,|;/)
        .map(keyword => keyword.trim())
        .filter(Boolean);
    }
  }

  return { summary: summary.trim(), keywords };
}

async function generateWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const resp = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
        responseMimeType: 'application/json'
      }
    },
    {
      params: { key: apiKey },
      headers: { 'Content-Type': 'application/json' }
    }
  );

  const text = resp.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response');

  return parseSummaryResponse(text);
}

async function generateWithOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key') {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that extracts summaries and keywords.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 800
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  const text = resp.data.choices[0].message.content;
  return parseSummaryResponse(text);
}

// Generate summary and keywords using the configured AI provider.
async function generateSummaryAndKeywords(content, length = 'short', language = 'English', tone = 'Neutral') {
  const provider = (process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : 'openai')).toLowerCase();
  const prompt = buildSummaryPrompt(content, length, language, tone);

  if (provider === 'gemini') {
    return generateWithGemini(prompt);
  }

  return generateWithOpenAI(prompt);
}

async function generateEmbedding(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key') {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const resp = await axios.post('https://api.openai.com/v1/embeddings', {
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    input: text
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return resp.data.data[0].embedding;
}

module.exports = { generateSummaryAndKeywords, generateEmbedding };
