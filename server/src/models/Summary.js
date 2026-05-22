// Summary model
// Folder: server/src/models/Summary.js

const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalContent: { type: String, required: true },
  generatedSummary: { type: String, required: true },
  keywords: { type: [String], default: [] },
  summaryLength: { type: String, enum: ['short','medium','long'], default: 'short' },
  readingTimeOriginal: { type: Number },
  readingTimeSummary: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Summary', SummarySchema);
