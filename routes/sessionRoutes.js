const express = require("express");
const router = express.Router();
const sessionController = require("../src/Controllers/sessionController");

// session
router.route("/getAll").get(sessionController.getSessionConntrollerfn);
router.route("/create").post(sessionController.createSessionConntrollerfn);
router.route("/update").patch(sessionController.updateSessionConntrollerfn);
router
  .route("/delete/:id")
  .delete(sessionController.removeSessionConntrollerfn);
module.exports = router;
