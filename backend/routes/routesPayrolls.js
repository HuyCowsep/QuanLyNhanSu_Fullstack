const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/all', authMiddleware, roleMiddleware('admin'), payrollController.getAllPayrolls);
router.get('/:employeeId', authMiddleware, payrollController.getPayrollByEmployee);
router.post('/create', authMiddleware, roleMiddleware('admin'), payrollController.createPayroll);
router.put('/update/:payrollId', authMiddleware, roleMiddleware('admin'), payrollController.updatePayroll);
router.delete('/delete/:payrollId', authMiddleware, roleMiddleware('admin'), payrollController.deletePayroll);

module.exports = router;
