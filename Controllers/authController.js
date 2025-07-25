const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const cloudinary = require('../Config/cloudinary'); // تأكد من أنك استوردت cloudinary بشكل صحيح
const { upload } = require('../MiddleWare/multer'); // تأكد من أنك استوردت multer middleware
require('dotenv').config();
const Blacklist = require('../Models/blacklist');

exports.register = async (req, res) => {
    var token = null;
    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { username, email, password } = req.body;
    const profilePicture = req.file ? req.file.path : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    // console.log("req.file.path");  // طباعة البيانات للتأكد من وصولها
    // console.log("req.file.path:", req.file.path);  // طباعة البيانات للتأكد من وصولها



    const hashedPassword = await bcrypt.hash(password, 10); // قوة التشفير 10 متوسط

    try {
        const user = new User({
            username,
            email,
            password,
            profilePicture,
        });

        await user.save();
        token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ message: 'User registered successfully', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
    const newUser = new User({ username, email, password: hashedPassword, profilePicture: profilePicture });


}

exports.login = async (req, res) => {

    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const hashedPassword = await bcrypt.hash(user.password, 10); // قوة التشفير 10 متوسط

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });


    ///؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
};

exports.getAllUsers = async (req, res) => {
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    try {
        const users = await User.find(); // استرجاع جميع المستخدمين
        res.status(200).json(users); // إرسال البيانات كرد JSON
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
};

// دالة لتسجيل الخروج
exports.logout = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
  
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
  
    try {
      // إضافة التوكن إلى القائمة السوداء
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const blacklist = new Blacklist({ token });
      await blacklist.save();  // حفظ التوكن في قاعدة البيانات
  
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error: error.message });
    }
  };