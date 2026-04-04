const express = require("express");
const router = express.Router();

const serializeController = require("../controllers/serialize.controller");
const validateUrl = require("../middleware/validateUrl");

router.post("/", validateUrl, serializeController.serialize);


module.exports = router;
