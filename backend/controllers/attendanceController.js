const { Attendance, Employee } = require("../models");

// Lấy danh sách chấm công
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find().populate("employeeId", "firstName lastName position department").sort({ date: -1 });

    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy chấm công theo ID nhân viên
const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendances = await Attendance.find({ employeeId }).sort({ date: -1 });

    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Thêm chấm công mới
const createAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    // Kiểm tra nhân viên có tồn tại không
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: "Nhân viên không tồn tại" });
    }
    // Kiểm tra ngày chấm công đã tồn tại chưa
    const existingAttendance = await Attendance.findOne({ employeeId, date });
    if (existingAttendance) {
      return res.status(400).json({ message: "Nhân viên này đã chấm công ngày này" });
    }
    // Lấy giờ hiện tại theo múi giờ Việt Nam
    const now = new Date();
    const checkInTime = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    // Mặc định giờ vào làm là 08:00
    const standardCheckInTime = "08:00";
    // Kiểm tra nếu nhân viên vào làm sau 08:00 thì ghi nhận "Đi muộn"
    const status = checkInTime > standardCheckInTime ? "Đi làm muộn" : "Đi làm";

    const newAttendance = new Attendance({
      employeeId,
      date,
      checkInTime, //Giờ tự động lấy từ hệ thống
      status,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Chấm công thành công", status, checkInTime });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật chấm công
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    // Lấy giờ hiện tại theo múi giờ Việt Nam
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    const attendance = await Attendance.findByIdAndUpdate(id, { checkOutTime }, { new: true });
    if (!attendance) {
      return res.status(404).json({ message: "Không tìm thấy chấm công, vui lòng thử lại" });
    }
    res.json({ message: "Cảm ơn bạn, chấm công ra về thành công", checkOutTime });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa chấm công
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) return res.status(404).json({ message: "Không tìm thấy chấm công" });

    res.json({ message: "Xóa chấm công thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getAllAttendances, getAttendanceByEmployee, createAttendance, updateAttendance, deleteAttendance };
