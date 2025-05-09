const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const Passwords = require('../models/Passwords');
const { generateToken } = require('../middleware/auth');


exports.register = async (req, res) => {
    try {
        const { userName, email, phoneNumber, website, password } = req.body;

        // if (!userName || !email || !phoneNumber || !website || !password) {
        //     return res.status(400).json({ error: 'Missing required fields' });
        // }

        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const existingWebsite = await Users.findOne({ where: { website } });
        if (existingWebsite) {
            return res.status(409).json({ error: 'Website already in use' });
        }

        const user = await Users.create({ userName, email, phoneNumber, website });

        await Passwords.create({
            userId: user.id,
            hashedPassword: password
        });

        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                website: user.website
            }
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

        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const passwordRecord = await Passwords.findOne({ where: { userId: user.id } });
        if (!passwordRecord) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, passwordRecord.hashedPassword);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken(user);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            website: user.website,
            token
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
