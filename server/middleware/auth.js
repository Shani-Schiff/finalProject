// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

exports.generateToken = (user) => {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        // 🛡️ בדיקה: האם userId שבראוט תואם ל־userId שבטוקן
        if (req.params.userId && String(req.params.userId) !== String(decoded.userId)) {
            return res.status(403).json({ error: 'Access denied: user ID mismatch' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
