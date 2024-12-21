const jwt = require('jsonwebtoken');  // استيراد مكتبة JWT
require('dotenv').config();
// Middleware للتحقق من التوكن
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');  // الحصول على التوكن من الهيدر

    // التحقق من وجود التوكن
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // التحقق من صحة التوكن
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // فك تشفير التوكن باستخدام المفتاح السري
        req.user = decoded;  // إضافة بيانات المستخدم إلى الـ request
        next();  // السماح بالمتابعة إلى المسار التالي
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });  // إذا كانت التوكن غير صالحة
    }
};

module.exports = authenticate;  // تصدير الميدلوير للاستخدام في باقي التطبيق
