const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.post('/', service.uploadMiddleware, service.applyTeacher);

module.exports = router;
