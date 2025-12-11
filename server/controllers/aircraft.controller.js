const { Aircraft } = require('../models');

// Get all aircrafts


// Create aircraft record


// Get all aircrafts
exports.getAllAircrafts = async (req, res) => {
  try {
    const aircrafts = await Aircraft.findAll();
    res.json(aircrafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single aircraft
exports.getAircraftById = async (req, res) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) return res.status(404).json({ message: 'Aircraft not found' });
    res.json(aircraft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new aircraft
exports.createAircraft = async (req, res) => {
  try {
    const { registration_no, hour_type, category, model } = req.body;

    // ---------------- VALIDATION ----------------
    if (!registration_no || registration_no.trim() === "") {
      return res.status(400).json({ error: "Registration Number is required" });
    }

    if (!hour_type || hour_type === "0") {
      return res.status(400).json({ error: "Hour Type is required" });
    }

    if (!category || category === "0") {
      return res.status(400).json({ error: "Category is required" });
    }

    if (!model || model.trim() === "") {
      return res.status(400).json({ error: "Model is required" });
    }

    // Optional: Check if registration number already exists
    const existingAircraft = await Aircraft.findOne({ where: { registrationNumber } });
    if (existingAircraft) {
      return res.status(400).json({ error: "Registration Number already exists" });
    }

    // --------------- CREATE AIRCRAFT --------------
    const aircraft = await Aircraft.create(req.body);

    res.status(201).json({
      message: "Aircraft created successfully",
      aircraft,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update aircraft
exports.updateAircraft = async (req, res) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) return res.status(404).json({ message: 'Aircraft not found' });
    await aircraft.update(req.body);
    res.json({ message: 'Aircraft updated', aircraft });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete aircraft
exports.deleteAircraft = async (req, res) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) return res.status(404).json({ message: 'Aircraft not found' });
    await aircraft.destroy();
    res.json({ message: 'Aircraft deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
