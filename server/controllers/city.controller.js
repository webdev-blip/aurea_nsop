const { City } = require("../models");
const { Op } = require("sequelize");

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, gmt } = req.body;

    if (!name || !gmt) {
      return res.status(400).json({
        success: false,
        message: "Name and GMT are required fields",
      });
    }

    const existingCity = await City.findOne({ where: { name } });
    if (existingCity) {
      return res.status(409).json({
        success: false,
        message: "City name already exists.",
      });
    }

    const city = await City.create({ name, gmt });

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      city, 
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL =================
exports.getAllcity = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const whereClause = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const offset = (page - 1) * limit;

    const { rows, count } = await City.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return res.json({
      success: true,
      cities: rows,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gmt } = req.body;

    const city = await City.findByPk(id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    if(name) {
      const existingCity = await City.findOne({ where: { name, id: { [Op.ne]: id } } });
      if (existingCity) {
        return res.status(409).json({
          success: false,
          message: "City name already exists.",
        });
      }
    }

    await city.update({ name, gmt });

    return res.json({
      success: true,
      message: "City updated successfully",
      city,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    await city.destroy();

    return res.json({
      success: true,
      message: "City deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
