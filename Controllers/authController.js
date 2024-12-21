const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');



exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { username, email, password } = req.body;
    const profilePicture = req.body["profileImagePath"] ? req.body["profileImagePath"] : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g_2Qj3LsNR-iqUAFm6ut2EQVcaou4u2YXw&s';

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });


    const hashedPassword = await bcrypt.hash(password, 10); // قوة التشفير 10 متوسط

    try {
        const user = new User({
            username,
            email,
            password,
            profilePicture,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
    const newUser = new User({ username, email, password: hashedPassword, profilePicture: profilePicture });


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