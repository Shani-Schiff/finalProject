const bcrypt = require('bcrypt');
const Users = require('../models/User');
const Passwords = require('../models/UserPassword');
const { generateToken } = require('../middleware/auth');
const logger = require('../logs/logger');

const validateRegistration = (userData) => {
    const { userName, email, phoneNumber, password } = userData;
    if (!userName || !email || !phoneNumber || !password) {
        return 'Missing required fields';
    }
    return null;
};

const checkExistingUser = async (email) => {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        return { error: 'Email already in use', status: 409 };
    }

    return null;
};

const createUserWithPassword = async (userData) => {
    const { userName, email, phoneNumber, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({ userName, email, phoneNumber });

    await Passwords.create({
        userId: user.userId,
        hashedPassword: hashedPassword
    });

    return user;
};

const prepareUserResponse = (user, token) => {
    return {
        id: user.userId,
        userName: user.userName || user.dataValues.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token
    };
};

exports.register = async (req, res) => {
    try {
        const validationError = validateRegistration(req.body);
        if (validationError) {
            logger.warn(`Registration attempt with invalid data`);
            return res.status(400).json({ error: validationError });
        }

        const { email } = req.body;
        const existingUser = await checkExistingUser(email);
        if (existingUser) {
            return res.status(existingUser.status).json({ error: existingUser.error });
        }

        const user = await createUserWithPassword(req.body);

        const token = generateToken(user);
        logger.info(`User registered successfully: ${user.userId}`);

        const response = {
            message: 'User registered successfully',
            token,
            user: prepareUserResponse(user, null)
        };

        res.status(201).json(response);
    } catch (err) {
        logger.error(`Registration error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

async function verifyUserCredentials(email, password) {
    const user = await Users.findOne({
        where: { email },
        attributes: ['userId', 'userName', 'email', 'phoneNumber']
    });

    if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return { error: 'Invalid credentials', status: 401 };
    }

    const passwordRecord = await Passwords.findOne({ where: { userId: user.userId } });
    if (!passwordRecord) {
        logger.warn(`User ${user.userId} has no password record`);
        return { error: 'Invalid credentials', status: 401 };
    }

    const match = await bcrypt.compare(password, passwordRecord.hashedPassword);
    if (!match) {
        logger.warn(`Failed login attempt for user ${user.userId}`);
        return { error: 'Invalid credentials', status: 401 };
    }

    return { user, status: 200 };
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn(`Login attempt with missing fields`);
            return res.status(400).json({ error: 'Missing fields' });
        }

        const authResult = await verifyUserCredentials(email, password);
        if (authResult.error) {
            return res.status(authResult.status).json({ error: authResult.error });
        }

        const token = generateToken(authResult.user);
        logger.info(`User logged in successfully: ${authResult.user.userId}`);

        res.json(prepareUserResponse(authResult.user, token));
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};