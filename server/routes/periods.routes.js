const express = require('express');
const router = express.Router();
const periodsController = require('../controllers/periods.controller');

// GET all models
router.get('/', periodsController.get);

// GET a specific model by ID
router.get('/:id', periodsController.getById);

// CREATE a new model
router.post('/', periodsController.create);

// UPDATE a model by ID
router.put('/:id', periodsController.update);

// DELETE a model by ID
router.delete('/:id', periodsController.delete);

module.exports = router;
