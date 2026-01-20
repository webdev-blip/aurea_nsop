const { Vendor, VendorCountry, VendorState, VendorCity } = require("../models");
const { Op } = require("sequelize");

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const {
      name,
      category_supplier,
      category_customer,
      is_service_provider,
      code,
      repair_station_cert,
      vendor_type,
      address,
      v_city_id,
      zip_code,
      state,
      country,
      phone1,
      phone2,
      phone3,
      fax,
      contact_person,
      email,
      nature_of_vendor,
    } = req.body;

    // Required fields
    if (!name || !address || !v_city_id) {
      return res.status(400).json({
        success: false,
        message: "Name, Address, and City are required fields",
      });
    }

    // Check duplicate name per city
    const nameExists = await Vendor.findOne({
      where: { name, v_city_id },
    });

    if (nameExists) {
      return res.status(409).json({
        success: false,
        message: "Vendor name already exists in this city.",
      });
    }

    // Check duplicate code (if provided)
    if (code) {
      const codeExists = await Vendor.findOne({ where: { code } });
      if (codeExists) {
        return res.status(409).json({
          success: false,
          message: "Vendor code already exists.",
        });
      }
    }

    const vendor = await Vendor.create({
      name,
      category_supplier: !!category_supplier,
      category_customer: !!category_customer,
      is_service_provider: !!is_service_provider,
      code: code || null,
      repair_station_cert,
      vendor_type,
      address,
      v_city_id,
      zip_code,
      state,
      country,
      phone1,
      phone2,
      phone3,
      fax,
      contact_person,
      email,
      nature_of_vendor,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors?.[0]?.path;
      return res.status(409).json({
        success: false,
        message: `${field} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL =================
exports.getAllvendor = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", v_city_id } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (v_city_id) {
      whereClause.v_city_id = Number(v_city_id);
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Vendor.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return res.json({
      success: true,
      vendors: rows,
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

// ================= GET BY ID =================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.json({
      success: true,
      vendor,
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

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const { name, code, v_city_id } = req.body;

    // Name duplicate check
    if (name) {
      const nameExists = await Vendor.findOne({
        where: {
          name,
          v_city_id: v_city_id ?? vendor.v_city_id,
          id: { [Op.ne]: id },
        },
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Vendor name already exists in this city.",
        });
      }
    }

    // Code duplicate check
    if (code) {
      const codeExists = await Vendor.findOne({
        where: {
          code,
          id: { [Op.ne]: id },
        },
      });

      if (codeExists) {
        return res.status(409).json({
          success: false,
          message: "Vendor code already exists.",
        });
      }
    }

    await vendor.update(req.body);
    await vendor.reload();

    return res.json({
      success: true,
      message: "Vendor updated successfully",
      vendor,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors?.[0]?.path;
      return res.status(409).json({
        success: false,
        message: `${field} already exists.`,
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

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    await vendor.destroy();

    return res.json({
      success: true,
      message: "Vendor deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= CREATE COUNTRY =================
exports.createCountry = async (req, res) => {
  try {
    const { country_name } = req.body;
    if (!country_name)
      return res
        .status(400)
        .json({ success: false, message: "Country name is required" });

    const exists = await VendorCountry.findOne({ where: { country_name } });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Country already exists" });

    const country = await VendorCountry.create({ country_name });
    res.status(201).json({ success: true, country });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET COUNTRIES =================
exports.getCountries = async (req, res) => {
  try {
    const countries = await VendorCountry.findAll({
      order: [["country_name", "ASC"]],
    });
    res.json({ success: true, countries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE COUNTRY =================
exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { country_name } = req.body;

    const country = await VendorCountry.findByPk(id);
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    if (country_name) {
      const existingCountry = await VendorCountry.findOne({
        where: { country_name, country_id: { [Op.ne]: id } },
      });
      if (existingCountry) {
        return res.status(409).json({
          success: false,
          message: "Country name already exists.",
        });
      }
    }

    await country.update({ country_name });

    return res.json({
      success: true,
      message: "Country updated successfully",
      country,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= REMOVE COUNTRIES =================

exports.removeCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await VendorCountry.findByPk(id);
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    await country.destroy();

    return res.json({
      success: true,
      message: "Country deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= CREATE STATE =================
exports.createState = async (req, res) => {
  try {
    const { state_name, country_id } = req.body;
    if (!state_name || !country_id)
      return res
        .status(400)
        .json({ success: false, message: "State and Country are required" });

    const exists = await VendorState.findOne({
      where: { state_name, country_id },
    });
    if (exists)
      return res
        .status(409)
        .json({
          success: false,
          message: "State already exists in this country",
        });

    const state = await VendorState.create({ state_name, country_id });
    res.status(201).json({ success: true, state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET STATES =================
exports.getStates = async (req, res) => {
  try {
    const states = await VendorState.findAll({
      include: [
        {
          model: VendorCountry,
          as: "country",
          attributes: ["country_id", "country_name"],
        },
      ],
      order: [["state_name", "ASC"]],
    });

    res.json({ success: true, states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE STATE =================
exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state_name, country_id } = req.body;

    const state = await VendorState.findByPk(id);
    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    if (state_name) {
      const existingState = await VendorState.findOne({
        where: { state_name, country_id, state_id: { [Op.ne]: id } },
      });
      if (existingState) {
        return res.status(409).json({
          success: false,
          message: "State name already exists in this country.",
        });
      }
    }

    await state.update({ state_name, country_id });

    return res.json({
      success: true,
      message: "State updated successfully",
      state,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= REMOVE STATES =================

exports.removeState = async (req, res) => {
  try {
    const { id } = req.params;

    const state = await VendorState.findByPk(id);
    if (!state) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    const cityCount = await VendorCity.count({
      where: { state_id: id },
    });

    if (cityCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete state. Cities exist under this state.",
      });
    }

    await state.destroy();

    return res.json({
      success: true,
      message: "State deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET STATES BY COUNTRY =================
exports.getStatesByCountry = async (req, res) => {
  try {
    const { country_id } = req.params;
    const states = await VendorState.findAll({
      where: { country_id },
      order: [["state_name", "ASC"]],
    });
    res.json({ success: true, states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= CREATE CITY =================
exports.createCity = async (req, res) => {
  try {
    const { v_city_name, state_id } = req.body;
    if (!v_city_name || !state_id)
      return res
        .status(400)
        .json({ success: false, message: "City and State are required" });

    const exists = await VendorCity.findOne({
      where: { v_city_name, state_id },
    });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "City already exists in this state" });

    const city = await VendorCity.create({ v_city_name, state_id });
    res.status(201).json({ success: true, city });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET CITIES BY STATE =================
exports.getCities = async (req, res) => {
  try {
    const cities = await VendorCity.findAll({
      order: [["v_city_name", "ASC"]],
    });
    res.json({ success: true, cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE CITY =================
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { v_city_name, state_id } = req.body;

    const city = await VendorCity.findByPk(id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    if (v_city_name) {
      const existingCity = await VendorCity.findOne({
        where: { v_city_name, v_city_id: { [Op.ne]: id } },
      });
      if (existingCity) {
        return res.status(409).json({
          success: false,
          message: "City name already exists.",
        });
      }
    }

    await city.update({ v_city_name, state_id });

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

// ================= REMOVE CITIES =================

exports.removeCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await VendorCity.findByPk(id);
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
