const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

router.post("/country", vendorController.createCountry);
router.get("/country", vendorController.getCountries);
router.put("/country/:id", vendorController.updateCountry);
router.delete("/country/:id", vendorController.removeCountry);

router.post("/state", vendorController.createState);
router.get("/state", vendorController.getStates);
router.put("/state/:id", vendorController.updateState);
router.delete("/state/:id", vendorController.removeState);

router.post("/city", vendorController.createCity);
router.get("/city", vendorController.getCities);
router.put("/city/:id", vendorController.updateCity);
router.delete("/city/:id", vendorController.removeCity); 

router.post("/", vendorController.create);
router.get("/", vendorController.getAllvendor);
router.get("/:id", vendorController.getById);
router.put("/:id", vendorController.update);
router.delete("/:id", vendorController.remove);

module.exports = router;
