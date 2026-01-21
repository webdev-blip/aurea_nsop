const { Place } = require("../models");
const { Op } = require("sequelize");

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { short_name, icao, name, city_id } = req.body;

    // Required fields
    if (!short_name || !name || !city_id) {
      return res.status(400).json({
        success: false,
        message: "Short Name, Name, and City are required fields",
      });
    }

    // Check short_name duplicate
    const shortNameExists = await Place.findOne({
      where: { short_name, city_id },
    });

    if (shortNameExists) {
      return res.status(409).json({
        success: false,
        message: "Short Name already exists.",
      });
    }

    // Check name duplicate
    const nameExists = await Place.findOne({
      where: { name, city_id },
    });

    if (nameExists) {
      return res.status(409).json({
        success: false,
        message: "Name already exists.",
      });
    }

    // Create
    const place = await Place.create({
      short_name,
      icao: icao || null,
      name,
      city_id,
    });

    return res.status(201).json({
      success: true,
      message: "Place created successfully",
      place,
    });

  } catch (err) {
    // 🔐 DB-level unique constraint fallback
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors?.[0]?.path;

      let message = "Place already exists.";

      if (field === "short_name") {
        message = "Short Name already exists.";
      } else if (field === "name") {
        message = "Name already exists.";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL =================
exports.getAllplace = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", city_id } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { short_name: { [Op.like]: `%${search}%` } },
            { icao: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    if (city_id) {
      whereClause.city_id = Number(city_id);
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Place.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return res.json({
      success: true,
      places: rows,
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
    const { short_name, icao, name, city_id } = req.body;

    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Check short_name duplicate (ignore same record)
    if (short_name) {
      const shortNameExists = await Place.findOne({
        where: {
          short_name,
          city_id,
          id: { [Op.ne]: id },
        },
      });

      if (shortNameExists) {
        return res.status(409).json({
          success: false,
          message: "Short Name already exists.",
        });
      }
    }

    // Check name duplicate (ignore same record)
    if (name) {
      const nameExists = await Place.findOne({
        where: {
          name,
          city_id,
          id: { [Op.ne]: id },
        },
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Name already exists.",
        });
      }
    }

    await place.update({
      short_name,
      icao: icao || null,
      name,
      city_id,
    });

    await place.reload();

    return res.json({
      success: true,
      message: "Place updated successfully",
      place,
    });

  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors?.[0]?.path;

      let message = "Place already exists.";

      if (field === "short_name") {
        message = "Short Name already exists.";
      } else if (field === "name") {
        message = "Name already exists.";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

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

    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    await place.destroy();

    return res.json({
      success: true,
      message: "Place deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
