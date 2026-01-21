const express = require("express");
const router = express.Router();
const placeController = require("../controllers/place.controller");

router.post("/", placeController.create);
router.get("/", placeController.getAllplace);
router.put("/:id", placeController.update);
router.delete("/:id", placeController.remove);

module.exports = router;
