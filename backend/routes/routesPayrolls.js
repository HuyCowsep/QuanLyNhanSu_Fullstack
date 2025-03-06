const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin"), payrollController.getAllPayrolls);
router.post("/create", authMiddleware, roleMiddleware("admin"), payrollController.createPayroll);

module.exports = router;
