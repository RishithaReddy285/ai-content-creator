// History routes
// Folder: server/src/routes/historyRoutes.js

const express = require('express');
const router = express.Router();
const { attachGuestUser } = require('../middlewares/guestUser');
const { listSummaries, getSummary, deleteSummary, searchSummaries } = require('../controllers/historyController');

router.get('/search/q', attachGuestUser, searchSummaries);
router.get('/', attachGuestUser, listSummaries);
router.get('/:id', attachGuestUser, getSummary);
router.delete('/:id', attachGuestUser, deleteSummary);

module.exports = router;
