const bcrypt = require('bcrypt');
const User = require('../models/User');
const Passwords = require('../models/UserPassword');
const { generateToken } = require('../middleware/auth');
const logger = require('../logs/logger');

const validateRegistration = (userData) => {
    const { user_name, email, phone_number, password } = userData;
    if (!user_name || !email || !phone_number || !password) {
        return 'Missing required fields';
    }
    return null;
};

const checkExistingUser = async (email) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        return { error: 'Email already in use', status: 409 };
    }

    return null;
};
const bcrpt = require('bcrypt');

bcrpt.hash("2", 10).then(hash => {
    console.log("Hashed password:", hash);
});


const createUserWithPassword = async (userData, currentUserRole = null) => {
    const { user_name, email, phone_number, password, role } = userData;
    const hashed_password = await bcrypt.hash(password, 10);

    const user = await User.create({
        user_name,
        email,
        phone_number,
        role: currentUserRole === 'admin' && role ? role : 'student'
    });

    await Passwords.create({
        user_id: user.user_id,
        hashed_password: hashed_password
    });

    return user;
};

const prepareUserResponse = (user, token) => {
    return {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
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
        logger.info(`User registered successfully: ${user.user_id}`);

        const response = {
            message: 'User registered successfully',
            token,
            user: prepareUserResponse(user, token)
        };

        res.status(201).json(response);
    } catch (err) {
        logger.error(`Registration error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

async function verifyUserCredentials(email, password) {
    const user = await User.findOne({
        where: { email },
        attributes: ['user_id', 'user_name', 'email', 'phone_number', 'role']
    });

    if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return { error: 'Invalid credentials', status: 401 };
    }

    const passwordRecord = await Passwords.findOne({ where: { user_id: user.user_id } });
    if (!passwordRecord) {
        logger.warn(`User ${user.user_id} has no password record`);
        return { error: 'Invalid credentials', status: 401 };
    }

    const match = await bcrypt.compare(password, passwordRecord.hashed_password);
    if (!match) {
        logger.warn(`Failed login attempt for user ${user.user_id}`);
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
        logger.info(`User logged in successfully: ${authResult.user.user_id}`);

        res.json(prepareUserResponse(authResult.user, token));
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};