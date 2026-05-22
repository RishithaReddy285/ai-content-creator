// History controller
// Folder: server/src/controllers/historyController.js

const Summary = require('../models/Summary');
const { deleteSummaryFromChroma, searchSummariesInChroma } = require('../utils/chroma');

exports.listSummaries = async (req, res, next) => {
  try {
    const summaries = await Summary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: summaries });
  } catch (err) {
    next(err);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const summary = await Summary.findOne({ _id: req.params.id, user: req.user._id });
    if (!summary) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};

exports.deleteSummary = async (req, res, next) => {
  try {
    const summary = await Summary.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!summary) return res.status(404).json({ message: 'Not found' });

    try {
      await deleteSummaryFromChroma(summary._id);
    } catch (err) {
      console.warn('Chroma delete skipped:', err.message);
    }

    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

// Basic search by text in originalContent or generatedSummary
exports.searchSummaries = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      const summaries = await Summary.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, data: summaries });
    }

    try {
      const chromaResults = await searchSummariesInChroma({
        userId: req.user._id,
        query: q,
        limit: Number(req.query.limit) || 20
      });

      if (chromaResults.length > 0) {
        const ids = chromaResults.map(result => result.id);
        const summaries = await Summary.find({ _id: { $in: ids }, user: req.user._id });
        const summaryById = new Map(summaries.map(summary => [String(summary._id), summary]));
        return res.json({
          success: true,
          source: 'chroma',
          data: ids.map(id => summaryById.get(id)).filter(Boolean)
        });
      }
    } catch (err) {
      console.warn('Chroma search skipped:', err.message);
    }

    const summaries = await Summary.find({
      user: req.user._id,
      $or: [
        { originalContent: { $regex: q, $options: 'i' } },
        { generatedSummary: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: summaries });
  } catch (err) {
    next(err);
  }
};
