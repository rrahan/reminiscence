const express = require("express");
const router = express.Router();

const purgeController = require("../controllers/purge.controller");

router.delete("/", purgeController.purge);


module.exports = router;
