const express = require('express');
const router = express.Router();
const communityController = require('../Controllers/communityController');
const authenticate = require('../MiddleWare/authenticate');  // للمصادقة

// إنشاء كوميونيتي جديدة
router.post('/create', authenticate, communityController.createCommunity);
 
// الانضمام إلى كوميونيتي
router.post('/join', authenticate, communityController.joinCommunity);

// عرض جميع الكوميونيتيز
router.get('/', authenticate, communityController.getAllCommunities);

// عرض تفاصيل كوميونيتي
router.get('/:communityId', authenticate, communityController.getCommunityDetails);

// إضافة عضو إلى كوميونيتي
router.post('/addMember', authenticate, communityController.addMemberToCommunity);

module.exports = router;
