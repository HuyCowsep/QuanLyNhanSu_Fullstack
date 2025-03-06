const { Department, Employee } = require("../models");

//lấy tất cả phòng ban
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("managerId", "firstName lastName");
    // Lấy danh sách nhân viên
    const departmentsWithEmployees = await Promise.all(
      departments.map(async (dept) => {
        const employees = await Employee.find({ department: dept._id }, "firstName lastName email position role");
        return {
          _id: dept._id,
          name: dept.name,
          description: dept.description,
          manager: dept.managerId ? `${dept.managerId.firstName} ${dept.managerId.lastName}` : "Chưa có quản lý",
          numberOfEmployees: employees.length, //đếm số nhân viên trong phòng ban
          employees: employees, //danh sách nhân viên trong phòng ban
          createdAt: dept.createdAt,
        };
      })
    );
    res.json(departmentsWithEmployees);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//lấy phòng ban theo id
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  const department = await Department.findById(id).populate("managerId", "name");
  if (!department) return res.status(404).json({ message: "Phòng ban không tồn tại" });
  res.json(department);
};

//tạo phòng ban
const createDepartment = async (req, res) => {
  const { name, description, managerId } = req.body;
  try {
    // Kiểm tra nếu phòng ban đã tồn tại
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Tên phòng ban đã tồn tại" });
    }
    // Kiểm tra nếu managerId hợp lệ (nếu có)
    if (managerId) {
      const manager = await Employee.findById(managerId);
      if (!manager) {
        return res.status(400).json({ message: "Manager không tồn tại" });
      }
    }
    // Tạo phòng ban mới
    const newDepartment = new Department({ name, description, managerId });
    await newDepartment.save();

    res.status(201).json({ message: "Tạo phòng ban thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//cập nhật phòng ban
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const department = await Department.findByIdAndUpdate(id, updates, { new: true });
  if (!department) return res.status(404).json({ message: "Phòng ban không tồn tại" });
  res.json({ message: "Cập nhật thành công", department });
};

//xoá phòng ban
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);
  if (!department) return res.status(404).json({ message: "Phòng ban không tồn tại" });
  res.json({ message: "Xóa thành công" });
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
