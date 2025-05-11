const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const Passwords = require('../models/Passwords');
const { generateToken } = require('../middleware/auth');
const logger = require('../logs/logger');

exports.register = async (req, res) => {
    try {
        const { userName, email, phoneNumber, website, password } = req.body;

        if (!userName || !email || !phoneNumber || !website || !password) {
            logger.warn(`Registration attempt with missing fields`);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            logger.warn(`Registration attempt with existing email: ${email}`);
            return res.status(409).json({ error: 'Email already in use' });
        }

        const existingWebsite = await Users.findOne({ where: { website } });
        if (existingWebsite) {
            logger.warn(`Registration attempt with existing website: ${website}`);
            return res.status(409).json({ error: 'Website already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await Users.create({ userName, email, phoneNumber, website });

        // Store the password separately
        await Passwords.create({
            userId: user.id,
            hashedPassword
        });

        const token = generateToken(user);

        logger.info(`User registered successfully: ${user.id}`);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                website: user.website
            }
        });
    } catch (err) {
        logger.error(`Registration error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn(`Login attempt with missing fields`);
            return res.status(400).json({ error: 'Missing fields' });
        }

        const user = await Users.findOne({
            where: { email },
            attributes: ['id', 'userName', 'email', 'phoneNumber', 'website']
        });

        if (!user) {
            logger.warn(`Login attempt with non-existent email: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordRecord = await Passwords.findOne({ where: { userId: user.id } });

        if (!passwordRecord) {
            logger.warn(`User ${user.id} has no password record`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, passwordRecord.hashedPassword);

        if (!match) {
            logger.warn(`Failed login attempt for user ${user.id}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);

        logger.info(`User logged in successfully: ${user.id}`);

        res.json({
            id: user.id,
            name: user.dataValues.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            website: user.website,
            token
        });
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};