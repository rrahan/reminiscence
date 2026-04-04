const validateUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, message: "URL is required" });
  }

  try {
    const parsedUrl = new URL(url);
    const supportedDomains = ['chatgpt.com', 'claude.ai', 'grok.com'];

    const isSupported = supportedDomains.some(domain => parsedUrl.hostname.includes(domain));

    if (!isSupported) {
      return res.status(400).json({ success: false, message: "Unsupported provider" });
    }

    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid URL provided" });
  }
};

module.exports = validateUrl;
