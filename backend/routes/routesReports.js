// backend/routes/routesReports.js
const express = require('express');
const router = express.Router();
const { generateEmployeeReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/reports/employees', authMiddleware, roleMiddleware('admin'), generateEmployeeReport);

module.exports = router;
