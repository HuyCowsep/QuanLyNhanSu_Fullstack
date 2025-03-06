const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/create", authMiddleware, roleMiddleware("admin"), notificationController.createNotification); //chỉ admin gửi thông báo
router.get("/", authMiddleware, notificationController.getAllNotifications);
//Nhân viên xem thông báo chung + thông báo của phòng ban mình.
router.get("/:departmentId", authMiddleware, notificationController.getNotificationsByDepartment);

module.exports = router;
