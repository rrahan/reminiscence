const serializeService = require("../services/parseContext");

// POST /api/serialize
const serialize = async (req, res, next) => {
  try {
    // 1. Controller extracts data from req.body
    const data = req.body;

    // 2. Pass the data (req.body) to the Service where the big business logic lives
    const result = await serializeService.performParsing(data);

    // 3. Send successful response
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // 4. Pass errors to the global error handler
    next(error);
  }
};



module.exports = { serialize };
