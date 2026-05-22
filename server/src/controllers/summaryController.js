// Summary controller
// Folder: server/src/controllers/summaryController.js

const fs = require('fs');
const Summary = require('../models/Summary');
const { extractTextFromFile, extractTextFromURL } = require('../utils/extractors');
const { generateSummaryAndKeywords } = require('../utils/openai');
const { indexSummaryInChroma } = require('../utils/chroma');

// Helper to estimate reading time (words per minute = 200)
function readingTime(text) {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.ceil(words / 200);
}

async function saveSummaryAndIndex(summary) {
  await summary.save();

  try {
    await indexSummaryInChroma(summary);
  } catch (err) {
    console.warn('Chroma indexing skipped:', err.message);
  }

  return summary;
}

// @route POST /api/summaries/text
exports.summarizeText = async (req, res, next) => {
  try {
    const { content, summaryLength = 'short', language = 'English', tone = 'Neutral' } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const { summary, keywords } = await generateSummaryAndKeywords(content, summaryLength, language, tone);

    const saved = new Summary({
      user: req.user._id,
      originalContent: content,
      generatedSummary: summary,
      keywords,
      summaryLength,
      readingTimeOriginal: readingTime(content),
      readingTimeSummary: readingTime(summary)
    });
    await saveSummaryAndIndex(saved);

    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/summaries/upload
exports.summarizeFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const path = req.file.path;
    const text = await extractTextFromFile(path);
    // cleanup uploaded file
    fs.unlink(path, () => {});

    const { summary, keywords } = await generateSummaryAndKeywords(text, req.body.summaryLength || 'short', req.body.language || 'English', req.body.tone || 'Neutral');

    const saved = new Summary({
      user: req.user._id,
      originalContent: text,
      generatedSummary: summary,
      keywords,
      summaryLength: req.body.summaryLength || 'short',
      readingTimeOriginal: readingTime(text),
      readingTimeSummary: readingTime(summary)
    });
    await saveSummaryAndIndex(saved);

    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/summaries/url
exports.summarizeURL = async (req, res, next) => {
  try {
    const { url, summaryLength = 'short', language = 'English', tone = 'Neutral' } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    const text = await extractTextFromURL(url);
    const { summary, keywords } = await generateSummaryAndKeywords(text, summaryLength, language, tone);

    const saved = new Summary({
      user: req.user._id,
      originalContent: text,
      generatedSummary: summary,
      keywords,
      summaryLength,
      readingTimeOriginal: readingTime(text),
      readingTimeSummary: readingTime(summary)
    });
    await saveSummaryAndIndex(saved);

    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
};
