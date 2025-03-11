const { Attendance, Employee } = require('../models');

// 📌 Lấy tất cả chấm công (Admin)
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employeeInfo',
        },
      },
      { $unwind: { path: '$employeeInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'departments',
          localField: 'employeeInfo.department',
          foreignField: '_id',
          as: 'departmentInfo',
        },
      },
      { $unwind: { path: '$departmentInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          date: 1,
          checkInTime: 1,
          checkOutTime: 1,
          status: 1,
          'employeeInfo.firstName': 1,
          'employeeInfo.lastName': 1,
          'departmentInfo.name': 1,
        },
      },
    ]);

    res.json(attendances);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách chấm công:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy chấm công theo ID nhân viên (Employee)
const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendances = await Attendance.find({ employeeId }).sort({ date: -1 });

    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Điểm danh chấm công CheckIn(Employee)
const createAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(400).json({ message: 'Nhân viên không tồn tại' });

    const existingAttendance = await Attendance.findOne({ employeeId, date });
    if (existingAttendance) return res.status(400).json({ message: 'Bạn đã chấm công hôm nay rồi' });

    const now = new Date();
    const checkInTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const standardCheckInTime = '08:00';
    const status = checkInTime > standardCheckInTime ? 'Đi làm muộn' : 'Đi làm';

    const newAttendance = new Attendance({ employeeId, date, checkInTime, status });
    await newAttendance.save();

    res.status(201).json({ message: 'Chấm công thành công', status, checkInTime });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Điểm danh CheckOut (Employee)
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });

    const attendance = await Attendance.findByIdAndUpdate(id, { checkOutTime }, { new: true });
    if (!attendance) return res.status(404).json({ message: 'Không tìm thấy chấm công' });

    res.json({ message: 'Chấm công ra thành công', checkOutTime });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa chấm công (Admin)
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) return res.status(404).json({ message: 'Không tìm thấy chấm công' });

    res.json({ message: 'Xóa chấm công thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getAllAttendances, getAttendanceByEmployee, createAttendance, updateAttendance, deleteAttendance };
