const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"], required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  position: { type: String },
  salary: { type: Number, default: 0 },
  role: { type: String, enum: ["Trưởng phòng", "Thành viên"], default: "Thành viên" },
  hireDate: { type: Date, default: Date.now }, //ngày bắt đầu làm việc
  avatar: { type: String, default: "default.jpg" },
  leaveDaysPerMonth: { type: Number, default: 2 }, // ✅ mỗi tháng có 2 ngày nghỉ phép
});

module.exports = mongoose.model("Employee", employeeSchema);
