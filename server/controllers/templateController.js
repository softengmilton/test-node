// controllers/templateController.js
const Template = require('../models/Template');

module.exports = {
  // GET /api/templates         → list all templates
  list: async (req, res) => {
    try {
      const templates = await Template.find();
      return res.status(200).json(templates);
    } catch (err) {
      console.error('templateController.list error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/templates        → create new template
  create: async (req, res) => {
    try {
      const { name, slug, previewImage, description } = req.body;
      if (!name || !slug)
        return res.status(400).json({ error: 'Name and slug are required' });

      const exists = await Template.findOne({ slug });
      if (exists)
        return res.status(400).json({ error: 'Slug already in use' });

      const newTemp = new Template({ name, slug, previewImage, description });
      const saved = await newTemp.save();
      return res.status(201).json(saved);
    } catch (err) {
      console.error('templateController.create error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/templates/:id      → fetch one template
  getOne: async (req, res) => {
    try {
      const template = await Template.findById(req.params.id);
      if (!template) return res.status(404).json({ error: 'Template not found' });
      return res.status(200).json(template);
    } catch (err) {
      console.error('templateController.getOne error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/templates/:id      → update a template
  update: async (req, res) => {
    try {
      const updated = await Template.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Template not found' });
      return res.status(200).json(updated);
    } catch (err) {
      console.error('templateController.update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/templates/:id   → delete a template
  delete: async (req, res) => {
    try {
      const tpl = await Template.findByIdAndDelete(req.params.id);
      if (!tpl) return res.status(404).json({ error: 'Template not found' });
      return res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('templateController.delete error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
