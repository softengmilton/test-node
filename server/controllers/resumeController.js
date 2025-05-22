// controllers/resumeController.js
const Resume = require('../models/Resume');

// ------------- RESUME CONTROLLERS -------------
module.exports = {
  // GET /api/resumes              → list all resumes for current user
  listMyResumes: async (req, res) => {
    try {
      const resumes = await Resume.find({ user: req.user._id })
        .populate('template') // optionally populate template details
        .sort({ createdAt: -1 });
      return res.status(200).json(resumes);
    } catch (err) {
      console.error('resumeController.listMyResumes error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/resumes/:id          → get one resume (owned by user)
  getOne: async (req, res) => {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('template');
      if (!resume) return res.status(404).json({ error: 'Resume not found' });
      return res.status(200).json(resume);
    } catch (err) {
      console.error('resumeController.getOne error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/resumes             → create a new resume (with free-limit check)
  create: async (req, res) => {
    try {
      // Destructure fields from req.body
      const {
        title,
        template,     // template ID
        personalInfo, // { fullName, email, phone, ... }
        education,    // array
        experience,   // array
        skills,       // array
        projects      // array
      } = req.body;

      // Create new resume document
      const newResume = new Resume({
        user: req.user._id,
        template,
        title,
        personalInfo,
        education,
        experience,
        skills,
        projects
      });

      const saved = await newResume.save();
      return res.status(201).json(saved);
    } catch (err) {
      console.error('resumeController.create error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/resumes/:id          → update a resume
  update: async (req, res) => {
    try {
      const updated = await Resume.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Resume not found' });
      return res.status(200).json(updated);
    } catch (err) {
      console.error('resumeController.update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/resumes/:id       → delete a resume
  delete: async (req, res) => {
    try {
      const del = await Resume.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });
      if (!del) return res.status(404).json({ error: 'Resume not found' });
      return res.status(200).json({ message: 'Resume deleted' });
    } catch (err) {
      console.error('resumeController.delete error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
