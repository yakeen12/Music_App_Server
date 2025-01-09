const express = require('express');
const router = express.Router();
const SearchController = require('../Controllers/searchController');  // تأكد من المسار الصحيح



router.get('/searchsongs', SearchController.searchSongs);

// راوت البحث مع التجزئة
router.get('/search', SearchController.search);



module.exports = router;
