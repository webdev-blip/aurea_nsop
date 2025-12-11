const express = require('express');
const router = express.Router();
const primarymodelController = require('../controllers/primarymodel.controller');

// GET all models
router.get('/', primarymodelController.getAllmodels);

// GET a specific model by ID
router.get('/:id', primarymodelController.getmodelById);

// CREATE a new model
router.post('/', primarymodelController.createModel);

// UPDATE a model by ID
router.put('/:id', primarymodelController.updateModel);

// DELETE a model by ID
router.delete('/:id', primarymodelController.deleteModel);

module.exports = router;
