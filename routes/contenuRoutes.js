const express = require("express");
const router = express.Router();
const contenuController = require("../src/Controllers/contenuController");
const auth = require("../middleware/auth");

// contenu
router.route("/getAll").get(contenuController.getContenuConntrollerfn);
router.route("/create").post(contenuController.createContenuConntrollerfn);
router.route("/update/:id").patch(contenuController.updateContenuConntrollerfn);
router.route("/delete/:id").delete(contenuController.getContenuConntrollerfn);
router.route("/**", auth);

module.exports = router;
