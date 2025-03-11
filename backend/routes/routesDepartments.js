const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, departmentController.getAllDepartments);
router.get('/:id', authMiddleware, departmentController.getDepartmentById);
router.post('/create', authMiddleware, roleMiddleware('admin'), departmentController.createDepartment);
router.put('/:id/update', authMiddleware, roleMiddleware('admin'), departmentController.updateDepartment);
router.delete('/:id/delete', authMiddleware, roleMiddleware('admin'), departmentController.deleteDepartment);

module.exports = router;
