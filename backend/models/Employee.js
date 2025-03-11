const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String, enum: ['', 'Nam', 'Nữ', 'Khác'] },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  position: { type: String },
  salary: { type: Number, default: 0 },
  role: { type: String, enum: ['Trưởng phòng', 'Thành viên'], default: 'Thành viên' },
  hireDate: { type: Date, default: Date.now }, //ngày bắt đầu làm việc
  avatar: { type: String, default: 'default.jpg' },
  leaveDaysPerMonth: { type: Number, default: 5 }, // mỗi tháng có 5 ngày nghỉ phép
});

module.exports = mongoose.model('Employee', employeeSchema);
