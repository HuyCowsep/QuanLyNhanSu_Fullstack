const { Payroll, Employee } = require("../models");

//hiển thị tất cả bảng lương
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate({
      path: "employeeId",
      select: "firstName lastName position role department",
      populate: {
        path: "department",
        select: "name",
      },
    });
    // Format lại dữ liệu trả về
    const formattedPayrolls = payrolls.map((payroll) => {
      const employee = payroll.employeeId;
      const department = employee.department ? employee.department.name : "Không có phòng ban";

      return {
        _id: payroll._id,
        employeeId: {
          _id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          role: employee.role === "Trưởng phòng" ? `Trưởng phòng của ${department}` : "Nhân viên",
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
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//tạo bảng lương
const createPayroll = async (req, res) => {
  try {
    const { employeeId, baseSalary, bonus = 0, deductions = 0 } = req.body;
    // Kiểm tra employeeId hợp lệ
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({ message: "Nhân viên không tồn tại" });
    }

    const total = baseSalary + bonus - deductions;
    const newPayroll = new Payroll({ employeeId, baseSalary, bonus, deductions, total });

    await newPayroll.save();
    res.status(201).json({ message: "Tạo bảng lương thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getAllPayrolls, createPayroll };
