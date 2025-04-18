// backend/routes/routesBackups.js
const express = require('express');
const router = express.Router();
const { backupDatabase } = require('../controllers/backupController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/backup', authMiddleware, roleMiddleware('admin'), backupDatabase);

module.exports = router;
