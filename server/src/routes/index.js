const express = require("express");

const router = express.Router();

// Mount feature routes
router.use("/serialize", require("./serialize.route"));

// Default API route
router.get("/", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

module.exports = router;
