const { User, Employee } = require('../models');
const jwt = require('jsonwebtoken');

//hàm đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email hoặc Mật khẩu không đúng!' });
    //so sánh mật khẩu
    if (password !== user.password) return res.status(400).json({ message: 'Email hoặc Mật khẩu không đúng!' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id, employeeId: user.employeeId || null, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server' });
  }
};

//hàm đăng ký
const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Tạo user mới
    const newUser = new User({ email, password, role: 'employee' });
    await newUser.save();

    // Tạo hồ sơ nhân viên rỗng tương ứng
    const newEmployee = await Employee.create({
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      gender: '',
      address: '',
      email,
      phone: '',
      department: null,
      position: '',
      salary: 0,
      role: 'Thành viên',
      hireDate: new Date(),
      avatar: 'default.jpg',
      leaveDaysPerMonth: 5,
    });

    // ✅ Gán employeeId vào user
    await User.findByIdAndUpdate(newUser._id, { employeeId: newEmployee._id });

    res.status(201).json({ message: 'Đăng ký thành công', userId: newUser._id, employeeId: newEmployee._id });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { login, register };
