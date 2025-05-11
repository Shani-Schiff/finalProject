const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const logger = require('../logs/logger');

// Authentication routes - no auth needed
router.post('/register', authController.register);
router.post('/login', authController.login);

// Middleware for authentication
router.use(verifyToken);

// Log middleware for all authenticated requests
router.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} by User ID: ${req.user ? req.user.userId : 'unknown'}`);
    next();
});

// Public routes
router.get('/posts', controller.getAllPosts);

// User specific routes
router.get('/users/:userId/:type', controller.getAll);
router.get('/users/:userId/:type/:id', controller.getById);
router.post('/users/:userId/:type', controller.create);
router.put('/users/:userId/:type/:id', controller.update);
router.delete('/users/:userId/:type/:id', controller.delete);

// Sub-item routes
router.get('/users/:userId/:type/:id/:subtype', controller.getSubItems);
router.post('/users/:userId/:type/:id/:subtype', controller.create);
router.put('/users/:userId/:type/:id/:subtype/:subId', controller.update);
router.delete('/users/:userId/:type/:id/:subtype/:subId', controller.delete);

// Error handling middleware
router.use((err, req, res, next) => {
    logger.error(`Error in route handler: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;