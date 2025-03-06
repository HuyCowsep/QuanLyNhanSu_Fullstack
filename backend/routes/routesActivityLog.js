const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLogController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin"), activityLogController.getAllLogs);
router.get("/:userId", authMiddleware, activityLogController.getUserLogs);

module.exports = router;
