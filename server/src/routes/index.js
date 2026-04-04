const express = require("express");

const router = express.Router();

//  routes
router.use("/serialize", require("./serialize.route"));
router.use("/purge", require("./purge.route"));

// Default API route
router.get("/", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

module.exports = router;
