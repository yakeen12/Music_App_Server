const express = require('express');
const router = express.Router();
const SearchController = require('../Controllers/searchController');  // تأكد من المسار الصحيح


// 搜索歌曲
router.get('/searchsongs', SearchController.searchSongs);


router.get('/search', SearchController.search);



module.exports = router;
