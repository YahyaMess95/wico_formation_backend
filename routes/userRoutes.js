const express = require("express");
const router = express.Router();
const userController = require("../src/Controllers/userController");
const analyseConroller = require("../src/Controllers/analyseConroller");
const auth = require("../middleware/auth");

// user
router.route("/login").post(userController.loginuserControllerfn);
router.route("/getAll").get(auth, userController.getDataConntrollerfn);
router.route("/getState").get(auth, analyseConroller.getCountControllerfn);
router.route("/create").post(auth, userController.createUserControllerfn);
router.route("/update/:id").patch(auth, userController.updateUserController);
router.route("/delete/:id").delete(auth, userController.deleteUserController);

module.exports = router;
