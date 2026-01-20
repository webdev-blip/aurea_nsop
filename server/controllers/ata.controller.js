const { ATA, SubATA } = require("../models");
const { Op } = require("sequelize");

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { code, chapter } = req.body;

    if (!code || !chapter) {
      return res.status(400).json({
        success: false,
        message: "Code and Chapter are required fields",
      });
    }

    const codeATA = await ATA.findOne({ where: { code } });
    if (codeATA) {
      return res.status(409).json({
        success: false,
        message: "ATA code already exists.",
      });
    }

    const chapterATA = await ATA.findOne({ where: { chapter } });
    if (chapterATA) {
      return res.status(409).json({
        success: false,
        message: "ATA chapter already exists.",
      });
    }

    const ata = await ATA.create({ code, chapter });

    return res.status(201).json({
      success: true,
      message: "ATA created successfully",
      ata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALL =================
exports.getAllata = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const whereClause = search ? { chapter: { [Op.like]: `%${search}%` } } : {};

    const offset = (page - 1) * limit;

    const { rows, count } = await ATA.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["code", "ASC"]],
    });

    return res.json({
      success: true,
      atas: rows,
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
    const { code, chapter } = req.body;

    const ata = await ATA.findByPk(id);
    if (!ata) {
      return res.status(404).json({
        success: false,
        message: "ATA not found",
      });
    }

    if (code) {
      const existingATA = await ATA.findOne({
        where: { code, id: { [Op.ne]: id } },
      });
      if (existingATA) {
        return res.status(409).json({
          success: false,
          message: "ATA code already exists.",
        });
      }
    }

    if (chapter) {
      const chapterATA = await ATA.findOne({
        where: { chapter, id: { [Op.ne]: id } },
      });
      if (chapterATA) {
        return res.status(409).json({
          success: false,
          message: "ATA chapter already exists.",
        });
      }
    }

    await ata.update({ code, chapter });

    return res.json({
      success: true,
      message: "ATA updated successfully",
      ata,
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

    const ata = await ATA.findByPk(id);
    if (!ata) {
      return res.status(404).json({
        success: false,
        message: "ATA not found",
      });
    }

    await ata.destroy();

    return res.json({
      success: true,
      message: "ATA deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= SUB ATA =================

// ================= CREATE =================
exports.subAtacreate = async (req, res) => {
  try {
    const {
      ata_id,
      ata_chapter,
      sub_ata_code,
      sub_code,
      sub_ata_chapter,
      description,
    } = req.body;

    if (!ata_id || !sub_ata_code || !sub_ata_chapter) {
      return res.status(400).json({
        success: false,
        message: "ATA, Sub ATA Code and Chapter required",
      });
    }

    const subata = await SubATA.create({
      ata_id,
      ata_chapter,
      sub_ata_code,
      sub_code,
      sub_ata_chapter,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Sub ATA created successfully",
      subata,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// ================= GET ALL =================
exports.getAllSubata = async (req, res) => {
  try {
    const { ataId } = req.params;

    if (!ataId) {
      return res.status(400).json({
        success: false,
        message: "ATA ID missing",
      });
    }

    const subatas = await SubATA.findAll({
      where: { ata_id: ataId },
      include: [
        {
          model: ATA,
          as: "ata",
        },
      ],
      order: [["sub_ata_code", "ASC"]],
    });

    return res.json({
      success: true,
      subatas,
      totalRecords: subatas.length,
      totalPages: 1,
    });
  } catch (err) {
    console.error("SUB ATA ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPDATE =================
exports.updateSubata = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ata_chapter,
      sub_ata_code,
      sub_code,
      sub_ata_chapter,
      description,
    } = req.body;

    const subata = await SubATA.findByPk(id);
    if (!subata) {
      return res.status(404).json({
        success: false,
        message: "Sub ATA not found",
      });
    }

    if (sub_ata_code) {
      const existingSubATA = await SubATA.findOne({
        where: { sub_ata_code, sub_ata_chapter, id: { [Op.ne]: id } },
      });
      if (existingSubATA) {
        return res.status(409).json({
          success: false,
          message: "Sub ATA code and Sub ATA Chapter already exists.",
        });
      }
    }

    await subata.update({
      ata_chapter,
      sub_ata_code,
      sub_code,
      sub_ata_chapter,
      description,
    });

    return res.json({
      success: true,
      message: "Sub ATA updated successfully",
      subata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.removeSubata = async (req, res) => {
  try {
    const { id } = req.params;

    const subata = await SubATA.findByPk(id);
    if (!subata) {
      return res.status(404).json({
        success: false,
        message: "Sub ATA not found",
      });
    }

    await subata.destroy();

    return res.json({
      success: true,
      message: "Sub ATA deleted successfully",
      id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
