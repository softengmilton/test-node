// middleware/subscribeMiddleware.js
const Resume = require('../models/Resume');

module.exports = async function (req, res, next) {
  try {
    const userId = req.user._id;
    // Count how many resumes this user already has
    const count = await Resume.countDocuments({ user: userId });
    // If count >= 3 and user.isSubscribed is false, block
    if (count >= 3 && !req.user.isSubscribed) {
      return res.status(403).json({
        error: 'Free resume limit (3) reached. Please subscribe to create more.'
      });
    }
    next();
  } catch (err) {
    console.error('subscribeMiddleware error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
