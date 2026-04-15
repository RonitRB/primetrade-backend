const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// Admin only route
router.get('/all', protect, adminOnly, getTasks);

module.exports = router;