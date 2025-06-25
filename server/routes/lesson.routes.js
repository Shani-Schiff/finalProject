const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.get('/', service.getAllGeneric);
router.get('/:id/lessons', service.getLessonsBySubjectId);
router.get('/:id', service.getGenericById);

module.exports = router;
