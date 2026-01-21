const express = require("express");
const router = express.Router();
const cityController = require("../controllers/city.controller");

router.post("/", cityController.create);
router.get("/", cityController.getAllcity);
router.put("/:id", cityController.update);
router.delete("/:id", cityController.remove);

module.exports = router;
