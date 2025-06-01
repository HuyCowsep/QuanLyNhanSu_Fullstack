require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Middleware
app.use(cors());

// KHÔNG ĐỂ `express.json()` TRƯỚC `multer`, để tránh lỗi khi upload file
app.use(express.urlencoded({ extended: true })); // Hỗ trợ form data (tốt cho multer)
app.use(express.json()); // Chỉ xử lý JSON, không ảnh hưởng đến Multer

// Gọi hàm kết nối từ config/db.js
connectDB();

// Import các file ở folder routes
const authRoutes = require('./routes/routesAuth');
const departmentRoutes = require('./routes/routesDepartments');
const payrollRoutes = require('./routes/routesPayrolls');
const employeeRoutes = require('./routes/routesEmployees');
const attendanceRoutes = require('./routes/routesAttendance');
const leaveRoutes = require('./routes/routesLeaves');
const activityLogRoutes = require('./routes/routesActivityLog');
const notificationRoutes = require('./routes/routesNotifications');

// Định tuyến API
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Đường dẫn ảnh đã upload
app.use('/api/auth', authRoutes); //route cho đăng nhập và đăng ký
app.use('/api/departments', departmentRoutes); //route cho phòng ban
app.use('/api/payroll', payrollRoutes); //route cho bảng lương
app.use('/api/employees', employeeRoutes); //route cho nhân viên
app.use('/api/attendance', attendanceRoutes); //route cho chấm công
app.use('/api/leaves', leaveRoutes); //route cho nghỉ phép
app.use('/api/activity-log', activityLogRoutes); //route cho log hoạt động
app.use('/api/notifications', notificationRoutes); //route cho thông báo

//Chạy ở cổng
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
