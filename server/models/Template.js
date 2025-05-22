const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  previewImage: { type: String },
  description: { type: String },
}, { timestamps: true });

const Template  = mongoose.model('Template', templateSchema);
module.exports = Template;