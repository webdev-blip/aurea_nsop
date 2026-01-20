const { AircraftModel  } = require('../models');

// Get all aircrafts

// Create new aircraft
// controllers/aircraftModelController.js
exports.createModel = async (req, res) => {
  try {
    const { manufacturer_id, model_name , assembly, primary_model_id } = req.body;
    // Basic validation
    if (!manufacturer_id || !model_name ) {
      return res.status(400).json({
        error: "Manufacturer and Model Name are required fields."
      });
    }

    const model = await AircraftModel.create({
      manufacturer_id,
      model_name ,
      assembly,
      primary_model_id
    });

    res.status(201).json({ message: "Model created successfully", model });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create aircraft record

// Get all aircrafts
exports.getAllmodels = async (req, res) => {
  try {

    // Fetch all aircraft models INCLUDING manufacturer
    const aircraftmodelList = await AircraftModel.findAll({
      include: [{ model: ManufacturerModel }]
    });

    res.json({
      models: aircraftmodelList
    });

  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: err.message });
  }
};



// Get single aircraft
exports.getmodelById = async (req, res) => {
  try {
    const AircraftModel  = await AircraftModel .findByPk(req.params.id);
    if (!AircraftModel ) return res.status(404).json({ message: 'Model not found' });
    res.json(AircraftModel );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update aircraft
exports.updateModel = async (req, res) => {
  try {
    const AircraftModel  = await AircraftModel .findByPk(req.params.id);
    if (!AircraftModel ) return res.status(404).json({ message: 'Aircraft not found' });
    await AircraftModel .update(req.body);
    res.json({ message: 'Model updated', AircraftModel  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete aircraft
exports.deleteModel = async (req, res) => {
  try {
    const aircraftModel  = await AircraftModel.findByPk(req.params.id);
    if (!aircraftModel) return res.status(404).json({ message: 'Aircraft not found' });
    await aircraftModel.destroy();
    res.json({ message: 'Aircraft deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
