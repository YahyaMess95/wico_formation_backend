const express = require("express");
const router = express.Router();
const userController = require("../src/Controllers/userController");
const sessionController = require("../src/Controllers/sessionController");
const formationController = require("../src/Controllers/formationController");
const photoController = require("../src/Controllers/photoController");

// public
router.route("/login").post(userController.loginuserControllerfn);
router.route("/recoverpassword").patch(userController.recoverControllerfn);
router.route("/getAll").get(sessionController.getSessionConntrollerfn);
router.route("/get/:id").get(formationController.getoneFormationConntrollerfn);
router.route("/photo/:fileId").get(photoController.getPhoto);

module.exports = router;
