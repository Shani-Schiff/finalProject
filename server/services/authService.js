const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logs/logger');

const User = require('../models/User');
const Passwords = require('../models/UserPassword');

const JWT_SECRET = process.env.JWT_SECRET;

// פונקציית יצירת טוקן
const generateToken = (user) => {
  return jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

// פונקציות עזר
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
    hashed_password
  });

  return user;
};

const prepareUserResponse = (user, token) => ({
  user_id: user.user_id,
  user_name: user.user_name,
  email: user.email,
  phone_number: user.phone_number,
  role: user.role,
  token
});

const verifyUserCredentials = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    attributes: ['user_id', 'user_name', 'email', 'phone_number', 'role']
  });

  if (!user) return { error: 'Invalid credentials', status: 401 };

  const passwordRecord = await Passwords.findOne({ where: { user_id: user.user_id } });
  if (!passwordRecord) return { error: 'Invalid credentials', status: 401 };

  const match = await bcrypt.compare(password, passwordRecord.hashed_password);
  if (!match) return { error: 'Invalid credentials', status: 401 };

  return { user, status: 200 };
};

// ייצוא הפונקציות לשימוש בראוטר
exports.register = async (req, res) => {
  try {
    const validationError = validateRegistration(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const existingUser = await checkExistingUser(req.body.email);
    if (existingUser) return res.status(existingUser.status).json({ error: existingUser.error });

    const user = await createUserWithPassword(req.body, req.user?.role);
    const token = generateToken(user);

    logger.info(`User registered successfully: ${user.user_id}`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: prepareUserResponse(user, token)
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const authResult = await verifyUserCredentials(email, password);
    if (authResult.error) return res.status(authResult.status).json({ error: authResult.error });

    const token = generateToken(authResult.user);
    logger.info(`User logged in successfully: ${authResult.user.user_id}`);

    res.json(prepareUserResponse(authResult.user, token));
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};
