const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const cloudinary = require('../Config/cloudinary'); // تأكد من أنك استوردت cloudinary بشكل صحيح
const { upload } = require('../MiddleWare/multer'); // تأكد من أنك استوردت multer middleware
require('dotenv').config();

exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { username, email, password } = req.body;
    const profilePicture = req.file ? req.file.path : 'example';

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    // console.log("req.file.path");  // طباعة البيانات للتأكد من وصولها
    console.log("req.file.path:", req.file.path);  // طباعة البيانات للتأكد من وصولها



    const hashedPassword = await bcrypt.hash(password, 10); // قوة التشفير 10 متوسط

    try {
        const user = new User({
            username,
            email,
            password,
            profilePicture,
        });

        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
    const newUser = new User({ username, email, password: hashedPassword, profilePicture: profilePicture }, token);


}

exports.login = async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });


    ///؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟؟
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '30d' });
    res.json({ token });
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // استرجاع جميع المستخدمين
        res.status(200).json(users); // إرسال البيانات كرد JSON
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
};