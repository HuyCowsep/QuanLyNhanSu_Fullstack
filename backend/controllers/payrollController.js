const { Payroll, Employee } = require('../models');

// Hiển thị tất cả bảng lương (Admin)
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate({
      path: 'employeeId',
      select: 'firstName lastName position role department',
      populate: {
        path: 'department',
        select: 'name',
      },
    });

    // Format lại dữ liệu trả về
    const formattedPayrolls = payrolls.map((payroll) => {
      const employee = payroll.employeeId;
      const department = employee.department ? employee.department.name : 'Không có phòng ban';

      return {
        _id: payroll._id,
        employeeId: {
          _id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          role: employee.role === 'Trưởng phòng' ? `Trưởng phòng của ${department}` : 'Nhân viên',
        },
        baseSalary: payroll.baseSalary,
        bonus: payroll.bonus,
        deductions: payroll.deductions,
        total: payroll.total,
        paymentDate: payroll.paymentDate,
      };
    });

    res.json(formattedPayrolls);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy bảng lương theo ID nhân viên (Employee)
const getPayrollByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payroll = await Payroll.find({ employeeId }).populate('employeeId', 'firstName lastName position department');

    if (!payroll) {
      return res.status(404).json({ message: 'Không tìm thấy bảng lương' });
    }

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Tạo bảng lương (Admin)
const createPayroll = async (req, res) => {
  try {
    const { employeeId, baseSalary, bonus = 0, deductions = 0, paymentDate } = req.body;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(400).json({ message: 'Nhân viên không tồn tại' });
    }

    const baseSalaryNum = Number(baseSalary);
    const bonusNum = Number(bonus);
    const deductionsNum = Number(deductions);
    const total = baseSalaryNum + bonusNum - deductionsNum;

    const newPayroll = new Payroll({
      employeeId,
      baseSalary: baseSalaryNum,
      bonus: bonusNum,
      deductions: deductionsNum,
      total,
      paymentDate: paymentDate ? new Date(paymentDate) : Date.now(), // Nếu có nhập ngày thì dùng, không thì lấy ngày hiện tại
    });

    await newPayroll.save();
    res.status(201).json({ message: 'Tạo bảng lương thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật bảng lương (Admin)
const updatePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const { baseSalary, bonus, deductions, paymentDate } = req.body;

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
      return res.status(404).json({ message: 'Bảng lương không tồn tại' });
    }

    payroll.baseSalary = baseSalary ?? payroll.baseSalary;
    payroll.bonus = bonus ?? payroll.bonus;
    payroll.deductions = deductions ?? payroll.deductions;
    payroll.total = payroll.baseSalary + payroll.bonus - payroll.deductions;
    payroll.paymentDate = paymentDate ? new Date(paymentDate) : payroll.paymentDate; // Nếu có nhập ngày mới thì cập nhật

    await payroll.save();
    res.json({ message: 'Cập nhật bảng lương thành công', payroll });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa bảng lương (Admin)
const deletePayroll = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const payroll = await Payroll.findByIdAndDelete(payrollId);

    if (!payroll) {
      return res.status(404).json({ message: 'Bảng lương không tồn tại' });
    }

    res.json({ message: 'Xóa bảng lương thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getAllPayrolls, getPayrollByEmployee, createPayroll, updatePayroll, deletePayroll };
