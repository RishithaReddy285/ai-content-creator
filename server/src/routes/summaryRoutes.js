// Summary routes
// Folder: server/src/routes/summaryRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { attachGuestUser } = require('../middlewares/guestUser');
const {
  summarizeText,
  summarizeFile,
  summarizeURL
} = require('../controllers/summaryController');

const upload = multer({ dest: 'uploads/' });

router.post('/text', attachGuestUser, summarizeText);
router.post('/upload', attachGuestUser, upload.single('file'), summarizeFile);
router.post('/url', attachGuestUser, summarizeURL);

module.exports = router;
