const express = require("express");
const router = express.Router();
const userController = require("../src/Controllers/userController");
const auth = require("../middleware/auth");

// user
router.route("/login").get(userController.loginuserControllerfn);
router.route("/getAll").get(auth, userController.getDataConntrollerfn);
router.route("/create").post(auth, userController.createUserControllerfn);
router.route("/update/:id").patch(auth, userController.updateUserController);
router.route("/delete/:id").delete(auth, userController.deleteUserController);

module.exports = router;
