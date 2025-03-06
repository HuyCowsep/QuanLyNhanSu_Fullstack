const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, employeeController.getAllEmployees);
router.get("/:id", authMiddleware, employeeController.getEmployeeById);
router.post("/create", authMiddleware, roleMiddleware("admin"), employeeController.createEmployee);
router.put("/:id/update", authMiddleware, roleMiddleware("admin"), employeeController.updateEmployee);
router.delete("/:id/delete", authMiddleware, roleMiddleware("admin"), employeeController.deleteEmployee);

module.exports = router;
