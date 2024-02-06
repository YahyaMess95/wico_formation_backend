const express = require("express");
const router = express.Router();
const seanceContoller = require("../src/Controllers/seanceContoller");
const auth = require("../middleware/auth");

// seance
router.route("/getAll").get(seanceContoller.getSeanceConntrollerfn);
router.route("/create").post(seanceContoller.createSeanceConntrollerfn);
router.route("/update/:id").patch(seanceContoller.updateSeanceConntrollerfn);
router.route("/delete/:id").delete(seanceContoller.removeSeanceConntrollerfn);
router.route("/**", auth);
module.exports = router;
