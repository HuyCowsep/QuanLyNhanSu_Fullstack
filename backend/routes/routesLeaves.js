const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware('admin'), leaveController.getAllLeaves);
router.get('/:employeeId', authMiddleware, leaveController.getLeaveByEmployee);
router.post('/create', authMiddleware, leaveController.createLeave);
router.put('/:id/update', authMiddleware, roleMiddleware('admin'), leaveController.updateLeaveStatus);
router.delete('/:id/delete', authMiddleware, leaveController.deleteLeave);
router.get('/remaining/:employeeId', authMiddleware, leaveController.getRemainingLeaveDays);

module.exports = router;
