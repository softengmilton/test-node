// seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your Mongoose models:
const User = require('./models/User');
const Template = require('./models/Template');
const Resume = require('./models/Resume');

async function runSeeder() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // 2. Clear existing collections (optional)
    await User.deleteMany({});
    await Template.deleteMany({});
    await Resume.deleteMany({});
    console.log('🗑 Cleared existing Users, Templates, and Resumes');

    // 3. Create some Templates
    const templatesData = [
      {
        name: 'Classic Blue',
        slug: 'classic-blue',
        previewImage: '/images/templates/classic-blue.png',
        description: 'A timeless blue-accented layout with clean typography.',
      },
      {
        name: 'Modern Minimal',
        slug: 'modern-minimal',
        previewImage: '/images/templates/modern-minimal.png',
        description: 'A minimalist, black-and-white template with subtle icons.',
      },
      {
        name: 'Creative Color',
        slug: 'creative-color',
        previewImage: '/images/templates/creative-color.png',
        description: 'A colorful, graphic-forward template for designers.',
      }
    ];

    const createdTemplates = await Template.insertMany(templatesData);
    console.log('✅ Inserted Templates:', createdTemplates.map(t => t.slug));

    // 4. Create some Users (with hashed passwords)
    const usersData = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        stripeCustomerId: null,
        isSubscribed: false,
        userType: 'user'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        passwordHash: await bcrypt.hash('securePass!', 10),
        stripeCustomerId: null,
        isSubscribed: true,
        userType: 'user'
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log('✅ Inserted Users:', createdUsers.map(u => u.email));

    // 5. Create some Resumes for each user
    const resumesData = [];

    // For Alice: create 2 resumes
    const alice = createdUsers.find(u => u.email === 'alice@example.com');
    resumesData.push({
      user: alice._id,
      template: createdTemplates.find(t => t.slug === 'classic-blue')._id,
      title: 'Alice Johnson – Software Engineer',
      personalInfo: {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1-555-0100',
        address: '123 Maple Street, Hometown, USA',
        linkedin: 'linkedin.com/in/alicejohnson',
        website: 'https://alice.dev',
        summary: 'Passionate Software Engineer with 5 years of experience in full-stack development.'
      },
      education: [
        {
          school: 'State University',
          degree: 'BSc Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: new Date('2013-09-01'),
          endDate: new Date('2017-05-01'),
          description: 'Graduated with honors, GPA: 3.8/4.0.'
        }
      ],
      experience: [
        {
          company: 'TechCorp',
          jobTitle: 'Frontend Developer',
          startDate: new Date('2017-06-01'),
          endDate: new Date('2019-12-01'),
          currentlyWorking: false,
          description: 'Built responsive React-based user interfaces for e-commerce platform.'
        },
        {
          company: 'InnoSoft',
          jobTitle: 'Full Stack Engineer',
          startDate: new Date('2020-01-01'),
          endDate: null,
          currentlyWorking: true,
          description: 'Developing Node.js microservices and React components for SaaS analytics product.'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Expert' },
        { name: 'React', level: 'Expert' },
        { name: 'Node.js', level: 'Intermediate' },
        { name: 'MongoDB', level: 'Intermediate' }
      ],
      projects: [
        {
          title: 'Project A',
          link: 'https://github.com/alice/project-a',
          description: 'Open-source React component library.'
        },
        {
          title: 'Project B',
          link: 'https://github.com/alice/project-b',
          description: 'Node.js CLI tool for data processing.'
        }
      ]
    });

    resumesData.push({
      user: alice._id,
      template: createdTemplates.find(t => t.slug === 'modern-minimal')._id,
      title: 'Alice Johnson – UI/UX Focused Resume',
      personalInfo: {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1-555-0100',
        address: '123 Maple Street, Hometown, USA',
        linkedin: 'linkedin.com/in/alicejohnson',
        website: 'https://alice.dev',
        summary: 'UI/UX Designer background combined with full-stack development skills.'
      },
      education: [
        {
          school: 'Design Institute',
          degree: 'Diploma in Graphic Design',
          fieldOfStudy: 'Graphic Design',
          startDate: new Date('2012-09-01'),
          endDate: new Date('2013-05-01'),
          description: 'Specialized in user-centered design principles.'
        }
      ],
      experience: [
        {
          company: 'Creative Labs',
          jobTitle: 'UI Designer',
          startDate: new Date('2013-06-01'),
          endDate: new Date('2016-12-01'),
          currentlyWorking: false,
          description: 'Designed wireframes and prototypes using Sketch and Figma.'
        }
      ],
      skills: [
        { name: 'Figma', level: 'Expert' },
        { name: 'Sketch', level: 'Intermediate' },
        { name: 'HTML/CSS', level: 'Expert' }
      ],
      projects: [
        {
          title: 'Design Portfolio',
          link: 'https://dribbble.com/alice',
          description: 'Collection of UI mockups and prototypes.'
        }
      ]
    });

    // For Bob: create 1 resume
    const bob = createdUsers.find(u => u.email === 'bob@example.com');
    resumesData.push({
      user: bob._id,
      template: createdTemplates.find(t => t.slug === 'creative-color')._id,
      title: 'Bob Smith – Marketing Specialist',
      personalInfo: {
        fullName: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1-555-0200',
        address: '456 Oak Avenue, Cityville, USA',
        linkedin: 'linkedin.com/in/bobsmith',
        website: 'https://bobsmith.com',
        summary: 'Digital Marketing Specialist with a focus on SEO and content strategy.'
      },
      education: [
        {
          school: 'University of Business',
          degree: 'BA Marketing',
          fieldOfStudy: 'Marketing',
          startDate: new Date('2011-09-01'),
          endDate: new Date('2015-05-01'),
          description: 'Graduated with dean’s list honors.'
        }
      ],
      experience: [
        {
          company: 'MarketMinds',
          jobTitle: 'Junior Marketing Associate',
          startDate: new Date('2015-06-01'),
          endDate: new Date('2018-08-01'),
          currentlyWorking: false,
          description: 'Managed social media campaigns and brand partnerships.'
        },
        {
          company: 'GrowthHackers Inc.',
          jobTitle: 'Senior Marketing Specialist',
          startDate: new Date('2018-09-01'),
          endDate: null,
          currentlyWorking: true,
          description: 'Leading SEO strategy and content team to increase organic traffic by 200%.'
        }
      ],
      skills: [
        { name: 'SEO', level: 'Expert' },
        { name: 'Content Strategy', level: 'Expert' },
        { name: 'Google Analytics', level: 'Intermediate' }
      ],
      projects: [
        {
          title: 'Blog Revamp',
          link: 'https://bobsmith.com/blog',
          description: 'Redesigned corporate blog, boosting engagement by 60%.'
        }
      ]
    });

    // 6. Insert all resumes
    const createdResumes = await Resume.insertMany(resumesData);
    console.log('✅ Inserted Resumes:', createdResumes.map(r => r.title));

    console.log('🎉 Seeding complete. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
}

runSeeder();
