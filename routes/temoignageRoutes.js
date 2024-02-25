const express = require("express");
const router = express.Router();
const temoignageContoller = require("../src/Controllers/temoignageContoller");

// temoignage
router.route("/getAll").get(temoignageContoller.getTemoignageConntrollerfn);
router.route("/create").post(temoignageContoller.createTemoignageConntrollerfn);
router
  .route("/update/:id")
  .patch(temoignageContoller.updateTemoignageConntrollerfn);
router
  .route("/delete/:id")
  .delete(temoignageContoller.removeTemoignageConntrollerfn);

module.exports = router;
