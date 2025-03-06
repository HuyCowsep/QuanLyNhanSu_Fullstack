const { User } = require("../models");
const jwt = require("jsonwebtoken");

//hàm đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email hoặc Mật khẩu không đúng!" });
    //so sánh mật khẩu
    if (password !== user.password) return res.status(400).json({ message: "Email hoặc Mật khẩu không đúng!" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//hàm đăng ký
const register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo user mới với password dạng plain text
    const newUser = new User({ email, password, role });
    await newUser.save();

    // Trả về thông báo thành công
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { login, register };
