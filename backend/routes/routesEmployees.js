const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../utils/upload');

router.get('/', authMiddleware, employeeController.getAllEmployees);
router.get('/:id', authMiddleware, employeeController.getEmployeeById);
router.post('/create', authMiddleware, roleMiddleware('admin'), employeeController.createEmployee);
router.put('/:id/update', authMiddleware, employeeController.updateEmployee);
router.put('/:id/salary/update', authMiddleware, roleMiddleware('admin'), employeeController.updateEmployeeSalary);
router.delete('/:id/delete', authMiddleware, roleMiddleware('admin'), employeeController.deleteEmployee);
router.post('/:id/upload-avatar', authMiddleware, upload.single('avatar'), employeeController.uploadAvatar);

module.exports = router;
