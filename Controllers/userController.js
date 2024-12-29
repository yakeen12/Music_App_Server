const Song = require('../Models/song');
const User = require('../Models/user'); // استيراد الموديل الخاص بالمستخدم
// const bcrypt = require('bcrypt'); // لتشفير كلمات المرورs
const jwt = require('jsonwebtoken'); // لإنشاء التوكين



// دالة للحصول على بيانات المستخدم باستخدام الـ userId
exports.getUserProfile = async (req, res) => {
    console.log("User ID from token:", req.user.userId);  // طباعة ID المستخدم من التوكن للتحقق

    try {
        // الحصول على المستخدم بناءً على الـ userId من التوكن
        const user = await User.findById(req.user.userId).select('-password');  // استبعاد كلمة المرور من النتائج
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // إرجاع بيانات المستخدم
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

// تعديل معلومات المستخدم
exports.updateUserProfile = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

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


// GET: استرجاع الأغاني المفضلة للمستخدم
exports.getLikedSongs = async (req, res) => {
    console.log("getLikedSongs");
    try {

        const user = await User.findById(req.user.userId);
        console.log("user", user);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ likedSongs: user.likedSongs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching liked songs', error });
    }
};

exports.toggleLikeSong = async (req, res) => {
    console.log("toggleLikeSong");
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها


    try {

        const user = await User.findById(req.user.userId);
        console.log("user", user);

        if (!user) return res.status(404).json({ message: 'toggleLikeSong User not found' });

        console.log("user", req.user.id);

        const { songId, like } = req.body;



        // التحقق من وجود الأغنية
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: 'Song not found' });

        if (like) {
            // إضافة الأغنية إذا لم تكن موجودة
            if (!user.likedSongs.some((likedSong) => likedSong._id.toString() === songId)) {
                user.likedSongs.push(songId);
                if (!song.likes.includes(userId)) {
                    song.likes.push(userId); // إضافة المستخدم لقائمة الإعجابات في الأغنية
                }
            }
        } else {
            // إزالة الأغنية إذا كانت موجودة
            user.likedSongs = user.likedSongs.filter(
                (likedSong) => likedSong._id.toString() !== songId
            );
            song.likes = song.likes.filter((id) => id.toString() !== userId); // إزالة المستخدم من قائمة الإعجابات
        }

        // حفظ التعديلات
        await user.save();
        await song.save();

        res.json({ success: true, likedSongs: user.likedSongs });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like', error });
    }
};