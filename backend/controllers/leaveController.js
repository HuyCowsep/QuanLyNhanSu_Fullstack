const { Leave, Employee } = require('../models');

// Admin lấy ALL danh sách đơn nghỉ phép
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: 'employeeId',
        select: 'firstName lastName position department',
        populate: {
          path: 'department',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy đơn nghỉ phép theo ID nhân viên
const getLeaveByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaves = await Leave.find({ employeeId }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Nhân viên gửi đơn xin nghỉ phép
const createLeave = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;

    // Kiểm tra nhân viên có tồn tại không
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Nhân viên không tồn tại' });
    }
    // Tính số ngày xin nghỉ
    const start = new Date(startDate); //nghỉ từ ngày start
    const end = new Date(endDate); // nghỉ đến hết ngày end
    const leaveDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
    // Kiểm tra số ngày phép còn lại
    if (leaveDays > employee.leaveDaysPerMonth) {
      return res.status(400).json({ message: 'Bạn không đủ số ngày nghỉ phép' });
    }
    // Form nghỉ phép
    const newLeave = new Leave({
      employeeId,
      startDate,
      endDate,
      reason,
      status: 'Chờ duyệt',
    });

    await newLeave.save();
    res.status(201).json({ message: 'Gửi đơn nghỉ phép thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật trạng thái đơn nghỉ phép (Duyệt hoặc từ chối)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Đã duyệt', 'Từ chối'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: 'Không tìm thấy đơn nghỉ phép' });

    res.json({ message: 'Cập nhật trạng thái thành công', leave });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa đơn nghỉ phép
const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) return res.status(404).json({ message: 'Không tìm thấy đơn nghỉ phép' });

    res.json({ message: 'Xóa đơn nghỉ phép thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy số ngày phép còn lại của nhân viên trong tháng hiện tại
const getRemainingLeaveDays = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (1-12)
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
    // Tìm nhân viên
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    }
    // Đếm số ngày nghỉ phép đã được duyệt trong tháng hiện tại
    const approvedLeaves = await Leave.find({
      employeeId,
      status: 'Đã duyệt',
      startDate: { $gte: new Date(`${currentYear}-${currentMonth}-01`) },
      endDate: { $lt: new Date(`${currentYear}-${currentMonth + 1}-01`) },
    });
    // Tính tổng số ngày nghỉ đã dùng
    let usedLeaveDays = 0;
    approvedLeaves.forEach((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      usedLeaveDays += (end - start) / (1000 * 60 * 60 * 24) + 1; // Tính số ngày nghỉ
    });
    // Tính số ngày phép còn lại
    const remainingLeaveDays = Math.max(0, employee.leaveDaysPerMonth - usedLeaveDays);
    res.json({
      employee: `${employee.firstName} ${employee.lastName}`,
      leaveDaysPerMonth: employee.leaveDaysPerMonth,
      usedLeaveDays,
      remainingLeaveDays,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getAllLeaves, getLeaveByEmployee, createLeave, updateLeaveStatus, deleteLeave, getRemainingLeaveDays };
