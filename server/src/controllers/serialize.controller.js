const serializeService = require("../services/parseContext");
const createMarkDown = require("../utils/createMarkDown")
const uploadMD = require("../services/uploadMD")


const serialize = async (req, res, next) => {
  try {
    const data = req.body;
    const chatHistory = await serializeService.performParsing(data);

    const markdownString = createMarkDown(chatHistory)

    const response = await uploadMD(markdownString)

    res.status(200).json({ success: true, url: response.url, id: response.file_id });
  } catch (error) {
    next(error);
  }
};



module.exports = { serialize };
