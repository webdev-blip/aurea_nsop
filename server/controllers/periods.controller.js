const { Periods } = require('../models');
const { Op } = require("sequelize");
// Get all aircrafts

// Create new aircraft
// controllers/manufacturersController.js
exports.create = async (req, res) => {
  try {
    const { selectedPeriods } = req.body;

    if (!selectedPeriods || selectedPeriods.length === 0) {
      return res.status(400).json({ message: "No periods selected" });
    }


    const period = await Periods.findOne({
      where: {
        name: { [Op.in]: selectedPeriods } // selectedPeriods = ["Jan","Feb"]
      }
    });

    if (period) {
    res.status(400).json({ status: 400, message: "Duplicate period found" });
    }

    // Insert each selected period
    const inserted = await Promise.all(
      selectedPeriods.map((period) =>
        Periods.create({ name: period })
      )
    );

    return res.status(200).json({
      message: "Periods saved successfully",
      data: inserted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Create aircraft record

// Get all aircrafts 
exports.get = async (req, res) => {
  try {
    const periods = await Periods.findAll(); // ✅ Use a different variable name
    res.json(periods);
  } catch (err) {
    console.error("Error fetching Periods:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single aircraft
exports.getById = async (req, res) => {
  try {
    const periods = await Periods.findByPk(req.params.id);
    if (!periods) return res.status(404).json({ message: 'Periods not found' });
    res.json(periods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update aircraft
exports.update = async (req, res) => {
  try {
    const periods = await Periods.findByPk(req.params.id);
    if (!periods) return res.status(404).json({ message: 'Periods not found' });
    await periods.update(req.body);
    res.json({ message: 'Periods updated', periods });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete aircraft
exports.delete = async (req, res) => {
  try {
    const periods = await Periods.findByPk(req.params.id);
    if (!periods) return res.status(404).json({ message: 'Periods not found' });
    await periods.destroy();
    res.json({ message: 'Periods deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
