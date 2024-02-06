const express = require("express");
const router = express.Router();
const temoignageContoller = require("../src/Controllers/temoignageContoller");
const auth = require("../middleware/auth");

// temoignage
router.route("/getAll").get(temoignageContoller.getTemoignageConntrollerfn);
router.route("/create").post(temoignageContoller.createTemoignageConntrollerfn);
router
  .route("/update/:id")
  .patch(temoignageContoller.updateTemoignageConntrollerfn);
router
  .route("/delete/:id")
  .delete(temoignageContoller.removeTemoignageConntrollerfn);
router.route("/**", auth);
module.exports = router;
