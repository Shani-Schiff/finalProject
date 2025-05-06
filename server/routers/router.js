const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/:type', controller.getAll);
router.get('/:type/:id', controller.getById);
router.post('/:type', controller.create);
router.put('/:type/:id', controller.update);
router.delete('/:type/:id', controller.delete);

// router.get('/login', controller.get);


module.exports = router;