require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); //import file kết nối MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Gọi hàm kết nối từ config/db.js
connectDB();

// Import các file ở folder routes
const authRoutes = require("./routes/routesAuth");
const departmentRoutes = require("./routes/routesDepartments");
const payrollRoutes = require("./routes/routesPayrolls");
const employeeRoutes = require("./routes/routesEmployees");
const attendanceRoutes = require("./routes/routesAttendance");
const leaveRoutes = require("./routes/routesLeaves");
const activityLogRoutes = require("./routes/routesActivityLog");
const notificationRoutes = require("./routes/routesNotifications");

// Định tuyến API
app.use("/api/auth", authRoutes); //route cho đăng nhập hoặc đăng ký: /api/auth/login ; /api/auth/register
app.use("/api/departments", departmentRoutes); //route cho phòng ban
app.use("/api/payroll", payrollRoutes); //route cho bảng lương
app.use("/api/employees", employeeRoutes); // Thêm route nhân viên
app.use("/api/attendance", attendanceRoutes); // Thêm route chấm công
app.use("/api/leaves", leaveRoutes); // Thêm route nghỉ phép
app.use("/api/activity-log", activityLogRoutes); // Thêm route lịch sử hoạt động
app.use("/api/notifications", notificationRoutes); // Thêm route thông báo

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});
