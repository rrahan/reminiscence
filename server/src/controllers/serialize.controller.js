const serializeService = require("../services/parseContext");

const serialize = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await serializeService.performParsing(data);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};



module.exports = { serialize };
