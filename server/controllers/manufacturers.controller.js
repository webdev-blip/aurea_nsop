const { ManufacturerModel   } = require('../models');

// Get all aircrafts

// Create new aircraft
// controllers/manufacturersController.js
exports.createModel = async (req, res) => {
  try {
    const {name} = req.body;
 
    // Basic validation
    if (!name) {
      return res.status(400).json({
        error: "Manufacturer name required fields."
      });
    }

    const data = await ManufacturerModel .create({
      name,
    });

    res.status(201).json({ message: "Manufacturer created successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create aircraft record

// Get all aircrafts
exports.getAllmodels = async (req, res) => {
  try {
    const manufacturers = await ManufacturerModel.findAll(); // ✅ Use a different variable name
    res.json(manufacturers);
  } catch (err) {
    console.error("Error fetching Manufacturer:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single aircraft
exports.getmodelById = async (req, res) => {
  try {
    const manufacturers  = await ManufacturerModel.findByPk(req.params.id);
    if (!manufacturers ) return res.status(404).json({ message: 'Manufacturer not found' });
    res.json(manufacturers );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update aircraft
exports.updateModel = async (req, res) => {
  try {
    const manufacturers  = await ManufacturerModel.findByPk(req.params.id);
    if (!manufacturers ) return res.status(404).json({ message: 'Manufacturer not found' });
    await manufacturers .update(req.body);
    res.json({ message: 'Manufacturer updated', manufacturers  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete aircraft
exports.deleteModel = async (req, res) => {
  try {
    const manufacturers  = await ManufacturerModel.findByPk(req.params.id);
    if (!manufacturers) return res.status(404).json({ message: 'Manufacturer not found' });
    await manufacturers.destroy();
    res.json({ message: 'Manufacturer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
