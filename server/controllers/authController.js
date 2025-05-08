const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const Passwords = require('../models/Passwords');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res) => {
    try {
        const { name, email, phoneNumber, website, password } = req.body;

        if (!name || !email || !phoneNumber || !website || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const existingWebsite = await Users.findOne({ where: { website } });
        if (existingWebsite) {
            return res.status(409).json({ error: 'Website already in use' });
        }

        // יצירת משתמש חדש
        const user = await Users.create({
            name,
            email,
            phoneNumber,
            website
        });

        // שמירת סיסמה בטבלה נפרדת
        const hashedPassword = await bcrypt.hash(password, 10);
        await Passwords.create({
            userId: user.id,
            passwordHash: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // שלב 1: מצא את המשתמש לפי אימייל
        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // שלב 2: מצא את הסיסמה שלו בטבלה הנפרדת
        const passwordRecord = await Passwords.findOne({ where: { userId: user.id } });
        if (!passwordRecord) return res.status(401).json({ error: 'Invalid credentials' });

        // שלב 3: השוואת הסיסמה המוזנת עם ההאש
        const match = await bcrypt.compare(password, passwordRecord.
            hashedPassword);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ message: 'Login successful', token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
