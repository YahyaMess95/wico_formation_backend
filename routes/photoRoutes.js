const express = require("express");
const router = express.Router();
const photoController = require("../src/Controllers/photoController");

router.route("/:photoName").get(photoController.getPhotoByName);

module.exports = router;
