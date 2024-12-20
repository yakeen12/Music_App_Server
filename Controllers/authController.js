const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');


exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Body is empty!');
    }
    console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10); // قوة التشفير 10 متوسط
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

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