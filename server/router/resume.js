// routes/resume.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const subscribeMiddleware = require('../middleware/subscribeMiddleware');
const {
  listMyResumes,
  getOne,
  create,
  update,
  delete: deleteResume
} = require('../controllers/resumeController');

// All routes below require authentication
router.use(authMiddleware);

router.get('/', listMyResumes);
router.get('/:id', getOne);

// When creating, apply subscribeMiddleware to enforce 3-resume free limit
router.post('/', subscribeMiddleware, create);

router.put('/:id', update);
router.delete('/:id', deleteResume);

module.exports = router;
