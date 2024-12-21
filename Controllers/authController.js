const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const cloudinary = require('../Config/cloudinary'); // تأكد من أنك استوردت cloudinary بشكل صحيح
const { upload } = require('../MiddleWare/multer'); // تأكد من أنك استوردت multer middleware


exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { username, email, password } = req.body;
    // const profilePicture = req.file ? req.file.path : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g_2Qj3LsNR-iqUAFm6ut2EQVcaou4u2YXw&s';

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    console.log("req.file.path");  // طباعة البيانات للتأكد من وصولها
    console.log("req.file.path:", req.file.path);  // طباعة البيانات للتأكد من وصولها
    console.log("req.body[]:", req.body["profilePicture"]);  // طباعة البيانات للتأكد من وصولها

    // print("req.file.path");
    // print(req.file.path);
    // print(req.body["profilePicture"]);
    let profileImageUrl = null;
    if (req.body["profilePicture"]) {
        const result = await cloudinary.uploader.upload(req.body["profilePicture"], {
            folder: 'user-pfps', // اسم المجلد
            allowed_formats: ['jpg', 'png', 'jpeg'], // صيغ الملفات المسموح بها
        });
        profileImageUrl = result.secure_url; // نحصل على رابط الصورة من Cloudinary
    }
    else {
        profileImageUrl = 'empty';
    }

    const hashedPassword = await bcrypt.hash(password, 10); // قوة التشفير 10 متوسط

    try {
        const user = new User({
            username,
            email,
            password,
            profileImageUrl,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
    const newUser = new User({ username, email, password: hashedPassword, profilePicture: profileImageUrl });


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