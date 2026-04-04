const axios = require('axios');

const LMFILES_API_KEY = process.env.LMF_API_KEY;

const purge = async (req, res, next) => {
    try {
        const ids = Array.isArray(req.body) ? req.body : req.body.ids;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: "Expected an array of ids" });
        }

        const deletePromises = ids.map(id => axios.delete(`https://lmfiles.com/api/v1/files/${id}`, {
            headers: {
                'X-API-Key': LMFILES_API_KEY
            }
        }));
        const responses = await Promise.all(deletePromises);

        res.status(200).json({ success: true, message: `Successfully deleted all file(s).` });
    } catch (error) {
        next(error);
    }
};

module.exports = { purge };