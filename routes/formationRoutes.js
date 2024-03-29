const express = require("express");
const router = express.Router();
const formationController = require("../src/Controllers/formationController");

// formation
router.route("/getAll").get(formationController.getFormationConntrollerfn);
router.route("/get/:id").get(formationController.getoneFormationConntrollerfn);
router.route("/create").post(formationController.createFormationConntrollerfn);
router
  .route("/update/:id")
  .patch(formationController.updateFormationConntrollerfn);
router
  .route("/delete/:id")
  .delete(formationController.removeFormationConntrollerfn);

module.exports = router;
