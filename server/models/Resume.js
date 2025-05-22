const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  title: { type: String, required: true },

  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String,
    summary: String,
  },

  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],

  experience: [{
    company: String,
    jobTitle: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: { type: Boolean, default: false },
    description: String,
  }],

  skills: [{
    name: String,
    level: String, // Beginner, Intermediate, Expert
  }],

  projects: [{
    title: String,
    link: String,
    description: String,
  }],
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema); 
module.exports = Resume; 