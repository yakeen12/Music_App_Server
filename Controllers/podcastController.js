const Podcast = require('../Models/podcast');  // استيراد النموذج الخاص بالبـودكاست
const Episode = require('../Models/episode');  // استيراد النموذج الخاص بالحلقات

// إضافة بودكاست جديد
const createPodcast = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    try {
        const { title, host, description, img } = req.body;

        // إنشاء البودكاست الجديد
        const newPodcast = new Podcast({
            img,
            title,
            host,
            description
        });

        await newPodcast.save();  // حفظ البودكاست في قاعدة البيانات
        res.status(201).json({ message: 'Podcast created successfully', podcast: newPodcast });
    } catch (error) {
        res.status(500).json({ message: 'Error creating podcast', error: error.message });
    }
};

// عرض جميع البودكاست
const getAllPodcasts = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    try {
        const podcasts = await Podcast.find();  // الحصول على جميع البودكاست
        res.status(200).json(podcasts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching podcasts', error: error.message });
    }
};

// عرض بودكاست معين بناءً على الـ ID
const getPodcastById = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    try {
        const podcast = await Podcast.findById(req.params.id)
            .populate({
                path: 'episodes', // ملء الحقل episodes
                populate: {
                    path: 'podcast', // ملء الحقل podcast داخل episodes
                    select: 'title img', // تحديد الحقول المطلوبة
                },
            });
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        res.status(200).json(podcast);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching podcast', error: error.message });
    }
};

// تحديث معلومات البودكاست
const updatePodcast = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    try {
        const { title, host, description } = req.body;

        const updatedPodcast = await Podcast.findByIdAndUpdate(
            req.params.id,
            { title, host, description },
            { new: true }
        );  // تحديث البودكاست باستخدام الـ ID

        if (!updatedPodcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        res.status(200).json({ message: 'Podcast updated successfully', podcast: updatedPodcast });
    } catch (error) {
        res.status(500).json({ message: 'Error updating podcast', error: error.message });
    }
};

// حذف بودكاست
const deletePodcast = async (req, res) => {
    try {
        const podcast = await Podcast.findByIdAndDelete(req.params.id);  // حذف البودكاست باستخدام الـ ID

        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        res.status(200).json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting podcast', error: error.message });
    }
};

// إضافة حلقة إلى البودكاست
const addEpisodeToPodcast = async (req, res) => {
    try {
        // const { episodeId } = req.body;

        // const podcast = await Podcast.findById(req.params.id);
        // if (!podcast) {
        //     return res.status(404).json({ message: 'Podcast not found' });
        // }

        // إضافة الحلقة إلى قائمة الحلقات الخاصة بالبودكاست
        podcast.episodes.push(episodeId);
        await podcast.save();

        res.status(200).json({ message: 'Episode added to podcast', podcast });
    } catch (error) {
        res.status(500).json({ message: 'Error adding episode', error: error.message });
    }
};

module.exports = {
    createPodcast,
    getAllPodcasts,
    getPodcastById,
    updatePodcast,
    deletePodcast,
    addEpisodeToPodcast
};
