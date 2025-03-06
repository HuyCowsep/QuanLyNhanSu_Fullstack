const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin"), attendanceController.getAllAttendances);
router.get("/:employeeId", authMiddleware, attendanceController.getAttendanceByEmployee);
router.post("/create", authMiddleware, roleMiddleware("admin"), attendanceController.createAttendance);
router.put("/:id/update", authMiddleware, roleMiddleware("admin"), attendanceController.updateAttendance);
router.delete("/:id/delete", authMiddleware, roleMiddleware("admin"), attendanceController.deleteAttendance);

module.exports = router;
