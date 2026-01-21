const express = require("express");
const router = express.Router();
const ataController = require("../controllers/ata.controller");

router.post("/", ataController.create);
router.get("/", ataController.getAllata);
router.put("/:id", ataController.update);
router.delete("/:id", ataController.remove);

router.post("/sub", ataController.subAtacreate);
router.get("/:ataId/sub", ataController.getAllSubata);
router.put("/sub/:id", ataController.updateSubata);
router.delete("/sub/:id", ataController.removeSubata);

module.exports = router;
