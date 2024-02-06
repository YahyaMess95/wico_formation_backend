const express = require("express");
const router = express.Router();
const adminController = require("../src/Controllers/adminController");

// admin
router.route("/login").post(adminController.loginadminControllerfn);
router.route("/register").post(adminController.registeradminControllerfn);

module.exports = router;
