const Community = require('../Models/community');
const User = require('../Models/user');  // لتحديث الأعضاء

// إنشاء كوميونيتي جديدة
exports.createCommunity = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { name } = req.body;

    try {
        const newCommunity = new Community({ name });
        await newCommunity.save();
        res.status(201).json({ message: 'Community created successfully', community: newCommunity });
    } catch (error) {
        res.status(500).json({ message: 'Error creating community', error });
    }
};
