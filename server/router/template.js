// routes/template.js
const express = require('express');
const router = express.Router();
const {
  list,
  create,
  getOne,
  update,
  delete: deleteTemplate
} = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');

// Anyone can list and getOne; only authenticated admins create/update/delete
router.get('/', list);
router.get('/:id', getOne);

// Protect the following routes:
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, deleteTemplate);

module.exports = router;
