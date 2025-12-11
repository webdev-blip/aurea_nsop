const express = require('express');
const router = express.Router();
const aircraftController = require('../controllers/aircraft.controller');

router.get('/', aircraftController.getAllAircrafts);
router.get('/:id', aircraftController.getAircraftById);
router.post('/', aircraftController.createAircraft);
router.put('/:id', aircraftController.updateAircraft);
router.delete('/:id', aircraftController.deleteAircraft);

module.exports = router;



