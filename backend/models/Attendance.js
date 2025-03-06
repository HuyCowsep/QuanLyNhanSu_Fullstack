const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  checkInTime: { type: String }, // Giờ vào làm (HH:mm)
  checkOutTime: { type: String }, // Giờ tan làm (HH:mm)
  status: {
    type: String,
    enum: ["Đi làm", "Đi làm muộn", "Nghỉ có phép", "Nghỉ không phép"],
    default: "Đi làm",
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
