const express = require('express');
const router = express.Router();
const service = require('../services/service');

router.get('/:type', service.getAll);
router.post('/:type', service.create);
router.get('/:type/:id', service.getGenericById);
router.put('/:type/:id', service.update);
router.delete('/:type/:id', service.delete);

router.get('/:type/:id/:subType', service.getSubItems);

module.exports = router;