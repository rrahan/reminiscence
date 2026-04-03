const express = require("express");
const router = express.Router();

const serializeController = require("../controllers/serialize.controller");


router.post("/", serializeController.serialize);


module.exports = router;
