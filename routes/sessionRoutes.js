const express = require("express");
const router = express.Router();
const sessionController = require("../src/Controllers/sessionController");
const auth = require("../middleware/auth");

// session
router.route("/getAll").get(sessionController.getSessionConntrollerfn);
router.route("/create").post(sessionController.createSessionConntrollerfn);
router.route("/update/:id").patch(sessionController.updateSessionConntrollerfn);
router
  .route("/delete/:id")
  .delete(sessionController.removeSessionConntrollerfn);
router.route("/**", auth);
module.exports = router;
