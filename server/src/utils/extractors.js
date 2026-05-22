// File and URL text extractors
// Folder: server/src/utils/extractors.js

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function extractTextFromFile(path) {
  const buffer = fs.readFileSync(path);
  // Try PDF first
  try {
    const data = await pdfParse(buffer);
    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }
  } catch (err) {
    // not a PDF
  }

  // Try docx via mammoth
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (result && result.value && result.value.trim().length > 0) {
      return result.value;
    }
  } catch (err) {
    // fallback
  }

  // Last resort: return buffer as utf8
  return buffer.toString('utf8');
}

async function extractTextFromURL(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  // Basic content extraction: get text from article tags or main
  let text = '';
  if ($('article').length) {
    $('article').each((i, el) => { text += $(el).text() + '\n'; });
  } else if ($('main').length) {
    $('main').each((i, el) => { text += $(el).text() + '\n'; });
  } else {
    // fallback: gather paragraphs
    $('p').each((i, el) => { text += $(el).text() + '\n'; });
  }
  return text.replace(/\s+/g, ' ').trim();
}

module.exports = { extractTextFromFile, extractTextFromURL };
