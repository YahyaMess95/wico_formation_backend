const express = require("express");
const router = express.Router();
const formationController = require("../src/Controllers/formationController");
const auth = require("../middleware/auth");

// formation
router.route("/getAll").get(formationController.getFormationConntrollerfn);
router.route("/create").post(formationController.createFormationConntrollerfn);
router
  .route("/update/:id")
  .patch(formationController.updateFormationConntrollerfn);
router
  .route("/delete/:id")
  .delete(formationController.removeFormationConntrollerfn);

router.route("/**", auth);

module.exports = router;
