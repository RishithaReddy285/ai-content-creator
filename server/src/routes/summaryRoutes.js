// Summary routes
// Folder: server/src/routes/summaryRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const {
  summarizeText,
  summarizeFile,
  summarizeURL
} = require('../controllers/summaryController');

const upload = multer({ dest: 'uploads/' });

router.post('/text', protect, summarizeText);
router.post('/upload', protect, upload.single('file'), summarizeFile);
router.post('/url', protect, summarizeURL);

module.exports = router;
