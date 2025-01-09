const express = require('express');
const router = express.Router();
const SearchController = require('../Controllers/searchController');  // تأكد من المسار الصحيح

// راوت البحث مع التجزئة
router.get('/search', SearchController.search);


router.get('/searchsongs', SearchController.search);

module.exports = router;
