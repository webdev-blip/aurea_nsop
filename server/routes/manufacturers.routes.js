const express = require('express');
const router = express.Router();
const manufacturersController = require('../controllers/manufacturers.controller');

// GET all models
router.get('/', manufacturersController.getAllmodels);

// GET a specific model by ID
router.get('/:id', manufacturersController.getmodelById);

// CREATE a new model
router.post('/', manufacturersController.createModel);

// UPDATE a model by ID
router.put('/:id', manufacturersController.updateModel);

// DELETE a model by ID
router.delete('/:id', manufacturersController.deleteModel);

module.exports = router;
