const express = require('express');
const Episode = require('../Models/episode'); // Assuming the Episode model is in a models folder
const Podcast = require('../Models/podcast'); // Assuming you have a Podcast model for host information

// Controller functions
const getAllEpisodes = async (req, res) => {
    try {
        const episodes = await Episode.find().populate({
            path: 'podcast',
            select: 'host', // Assuming the Podcast schema has a 'host' field
        });
        res.status(200).json(episodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLatestEpisodes = async (req, res) => {
    try {
        const episodes = await Episode.find()
            .sort({ _id: -1 }) // Sorting by most recent
            .limit(10)
            .populate({
                path: 'podcast',
                select: 'title img',
            });
        res.status(200).json(episodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEpisode = async (req, res) => {
    const { podcastID, title, episodeNumber, description, audioUrl } = req.body;
    try {
        const podcast = await Podcast.findById(podcastID);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        const newEpisode = new Episode({
            podcast,
            title,
            episodeNumber,
            description,
            audioUrl,
        });
        const savedEpisode = await newEpisode.save();
        podcast.episodes.push(newEpisode._id);
        await podcast.save;

        // Populate the host information after saving
        const populatedEpisode = await savedEpisode.populate({
            path: 'podcast',
            select: 'title img',
        });
        res.status(201).json({ message: 'Song added successfully', episode: populatedEpisode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export controller functions
module.exports = {
    getAllEpisodes,
    getLatestEpisodes,
    createEpisode,
};
