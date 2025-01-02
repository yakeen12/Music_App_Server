
const express = require('express');
const router = express.Router();
const episodeController = require('../Controllers/episodeController'); // Assuming this file is saved as episodeController.js

router.get('/', episodeController.getAllEpisodes); // Route to get all episodes
router.get('/latest', episodeController.getLatestEpisodes); // Route to get the latest 10 episodes
router.post('/', episodeController.createEpisode); // Route to create a new episode

module.exports = router;
