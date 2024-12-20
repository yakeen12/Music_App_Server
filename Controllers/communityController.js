const Community = require('../Models/community');
const User = require('../Models/user');  // لتحديث الأعضاء

// إنشاء كوميونيتي جديدة
exports.createCommunity = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.userId; // يمكنك الحصول عليه من JWT أو الجلسة

    try {
        const newCommunity = new Community({ name, description, creator: userId });
        await newCommunity.save();
        res.status(201).json({ message: 'Community created successfully', community: newCommunity });
    } catch (error) {
        res.status(500).json({ message: 'Error creating community', error });
    }
};

// الانضمام إلى كوميونيتي
exports.joinCommunity = async (req, res) => {
    const { communityId } = req.body;
    const userId = req.userId; // من الجلسة أو JWT

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // إضافة المستخدم إلى الأعضاء
        if (!community.members.includes(userId)) {
            community.members.push(userId);
            await community.save();
        }

        res.status(200).json({ message: 'Successfully joined the community' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining community', error });
    }
};

// عرض جميع الكوميونيتيز
exports.getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find().populate('creator', 'name'); // إظهار اسم المبدع
        res.status(200).json({ communities });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching communities', error });
    }
};

// عرض تفاصيل كوميونيتي معينة
exports.getCommunityDetails = async (req, res) => {
    const { communityId } = req.params;

    try {
        const community = await Community.findById(communityId)
            .populate('creator', 'name')  // إظهار اسم المبدع
            .populate('members', 'name'); // إظهار أسماء الأعضاء

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.status(200).json({ community });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community details', error });
    }
};

// إضافة عضو إلى كوميونيتي (عادة يتم من خلال الانضمام ولكن إذا أردت إضافته يدويًا)
exports.addMemberToCommunity = async (req, res) => {
    const { communityId, userId } = req.body;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // إضافة العضو
        if (!community.members.includes(userId)) {
            community.members.push(userId);
            await community.save();
        }

        res.status(200).json({ message: 'Member added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member', error });
    }
};
