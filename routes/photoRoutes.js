const express = require("express");
const router = express.Router();
const photoController = require("../src/Controllers/photoController");

// photo

router.route("/:filename").get(photoController.getPhoto);

module.exports = router;
