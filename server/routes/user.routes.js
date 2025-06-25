const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.get('/', service.getAllUsers);
router.get('/:user_id/lessons', service.getUserLessons);
router.put('/:userId', service.updateUserRole);

module.exports = router;
