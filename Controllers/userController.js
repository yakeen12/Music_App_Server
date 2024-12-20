const User = require('../Models/user'); // استيراد الموديل الخاص بالمستخدم
// const bcrypt = require('bcrypt'); // لتشفير كلمات المرورs
const jwt = require('jsonwebtoken'); // لإنشاء التوكين


// الحصول على معلومات المستخدم
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error });
    }
};

// تعديل معلومات المستخدم
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // الحصول على ID المستخدم من التوكين
        const { name, email, password } = req.body;

        // التحقق من البيانات الجديدة
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        // إذا كان هناك كلمة مرور جديدة، يتم تشفيرها
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        // تحديث المستخدم في قاعدة البيانات
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};


