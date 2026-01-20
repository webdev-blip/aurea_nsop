const { Primarymodel   } = require('../models');

// Get all aircrafts

// Create new aircraft
// controllers/manufacturersController.js
exports.createModel = async (req, res) => {
  try {
    const { name } = req.body;
    const newModel = await Primarymodel.create({ name }); // Sequelize
    res.status(201).json(newModel); // <-- must return the object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create aircraft record

// Get all aircrafts 
exports.getAllmodels = async (req, res) => {
  try {
    const primarymodel = await Primarymodel.findAll(); // ✅ Use a different variable name
    res.json(primarymodel);
  } catch (err) {
    console.error("Error fetching Primary model:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single aircraft
exports.getmodelById = async (req, res) => {
  try {
    const primarymodel  = await Primarymodel.findByPk(req.params.id);
    if (!primarymodel ) return res.status(404).json({ message: 'Primary model not found' });
    res.json(primarymodel );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update aircraft
exports.updateModel = async (req, res) => {
  try {
    const primarymodel  = await Primarymodel.findByPk(req.params.id);
    if (!primarymodel ) return res.status(404).json({ message: 'Primary model not found' });
    await primarymodel .update(req.body);
    res.json({ message: 'Primary model updated', primarymodel  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete aircraft
exports.deleteModel = async (req, res) => {
  try {
    const primarymodels  = await Primarymodel.findByPk(req.params.id);
    if (!primarymodels) return res.status(404).json({ message: 'Primary model not found' });
    await primarymodels.destroy();
    res.json({ message: 'Primary model deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
