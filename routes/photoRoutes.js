const express = require("express");
const router = express.Router();
const photoController = require("../src/Controllers/photoController");

// photo

router.route("/:fileId").get(photoController.getPhoto);
router.route("/update").patch(photoController.updatePhotoController);

module.exports = router;
