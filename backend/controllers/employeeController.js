const { Employee, Department, Leave, User } = require('../models');
const { logActivity } = require('../controllers/activityLogController');
const path = require('path');

// Lấy danh sách tất cả nhân viên
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name');
    // Cập nhật `leaveDaysPerMonth` cho từng nhân viên
    const updatedEmployees = await Promise.all(
      employees.map(async (employee) => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        // Tính số ngày nghỉ đã duyệt trong tháng này
        const approvedLeaves = await Leave.find({
          employeeId: employee._id,
          status: 'Đã duyệt',
          startDate: { $gte: new Date(`${currentYear}-${currentMonth}-01`) },
          endDate: { $lt: new Date(`${currentYear}-${currentMonth + 1}-01`) },
        });
        let usedLeaveDays = 0;
        approvedLeaves.forEach((leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          usedLeaveDays += (end - start) / (1000 * 60 * 60 * 24) + 1;
        });
        // `leaveDaysPerMonth` tối thiểu là 0
        const updatedLeaveDaysPerMonth = Math.max(0, employee.leaveDaysPerMonth - usedLeaveDays);

        return {
          ...employee.toObject(),
          leaveDaysPerMonth: updatedLeaveDaysPerMonth, // ✅ Cập nhật giá trị này
        };
      }),
    );
    res.json(updatedEmployees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy nhân viên theo ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate('department', 'name');
    if (!employee) return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Thêm nhân viên mới
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, address, email, phone, department, position, role, salary, hireDate, avatar, leaveDaysPerMonth } = req.body;
    const userId = req.user.id; // Lấy ID người dùng từ token để phục vụ cho cái ActivityLog
    // Kiểm tra email có tồn tại chưa
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    // Kiểm tra phòng ban có hợp lệ không (nếu có)
    if (department) {
      const dept = await Department.findById(department);
      if (!dept) {
        return res.status(400).json({ message: 'Phòng ban không tồn tại' });
      }
    }
    //form nhân viên mới
    const newEmployee = new Employee({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      email,
      phone,
      department,
      position,
      salary,
      role,
      hireDate,
      avatar: avatar || 'default.jpg',
      leaveDaysPerMonth: leaveDaysPerMonth || 5, // Mặc định là 5 ngày phép/tháng nếu không truyền
    });

    await newEmployee.save();
    // Gán employeeId vào user tương ứng
    await User.findByIdAndUpdate(req.user.id, { employeeId: newEmployee._id });
    //Ghi log lại
    await logActivity(userId, 'Thêm nhân viên', 'Employee', newEmployee._id);
    res.status(201).json({ message: 'Thêm nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

//Cập nhật nhân viên
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Check user có quyền sửa đúng employee của mình không
    const user = await User.findById(userId);
    if (!user || user.employeeId.toString() !== id) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật thông tin nhân viên này!' });
    }

    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true }).populate('department', 'name');
    if (!employee) return res.status(404).json({ message: 'Nhân viên không tồn tại' });

    await logActivity(userId, 'Cập nhật nhân viên', 'Employee', id);
    res.json({ message: 'Cập nhật thông tin nhân viên thành công', employee });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

//Xóa nhân viên
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Lấy ID người dùng từ token để phục vụ cho cái ActivityLog
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    // Ghi log
    await logActivity(userId, 'Xóa nhân viên', 'Employee', id);
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

//Tải lên ảnh đại diện
const uploadAvatar = async (req, res) => {
  console.log('🔹 Headers:', req.headers);
  console.log('🔹 Body:', req.body);
  console.log('🔹 File:', req.file);

  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: '❌ Không có file nào được tải lên' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    console.log('✅ File được lưu:', avatarPath);

    const employee = await Employee.findByIdAndUpdate(req.params.id, { avatar: avatarPath }, { new: true });
    if (!employee) {
      return res.status(404).json({ message: '⚠️ Nhân viên không tồn tại' });
    }

    res.json({ message: '✅ Ảnh đại diện đã được cập nhật', avatar: avatarPath });
  } catch (error) {
    console.error('🔥 Lỗi server:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, uploadAvatar };
