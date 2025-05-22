// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

router.post("/sync", requireAuth, async (req, res) => {
  const { email, name, clerkId } = req.body;

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ email, name, clerkId });
    } else {
      user.name = name;
      user.email = email;
      await user.save();
    }

    res.json({ message: "User synced", user });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
