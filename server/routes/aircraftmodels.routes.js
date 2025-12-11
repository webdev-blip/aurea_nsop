const express = require('express');
const router = express.Router();
const aircraftmodelsController = require('../controllers/aircraftmodel.controller');

// GET all models
router.get('/', aircraftmodelsController.getAllmodels);

// GET a specific model by ID
router.get('/:id', aircraftmodelsController.getmodelById);

// CREATE a new model
router.post('/', aircraftmodelsController.createModel);

// UPDATE a model by ID
router.put('/:id', aircraftmodelsController.updateModel);

// DELETE a model by ID
router.delete('/:id', aircraftmodelsController.deleteModel);

module.exports = router;
