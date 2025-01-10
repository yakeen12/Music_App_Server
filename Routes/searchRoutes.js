const express = require('express');
const router = express.Router();
const SearchController = require('../Controllers/searchController');  // تأكد من المسار الصحيح
const authenticate = require('../MiddleWare/authenticate');  


// 搜索歌曲
router.get('/searchsongs', SearchController.searchSongs);


router.get('/search', authenticate,SearchController.search);

router.get('/searchplaylists', authenticate,SearchController.searchPlayLists);

router.get('/searchusers', authenticate,SearchController.searchUsers);


module.exports = router;
