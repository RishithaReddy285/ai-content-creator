// History routes
// Folder: server/src/routes/historyRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { listSummaries, getSummary, deleteSummary, searchSummaries } = require('../controllers/historyController');

router.get('/search/q', protect, searchSummaries);
router.get('/', protect, listSummaries);
router.get('/:id', protect, getSummary);
router.delete('/:id', protect, deleteSummary);

module.exports = router;
