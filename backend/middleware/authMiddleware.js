const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  //check token Đề phòng thằng frontend hoặc Postman gửi linh tinh.
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có TOKEN, quyền hạn bị từ chối' });
  }
  // Lấy token lúc login thành công rồi kiểm tra trong Header: authoization, bearer token
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = authMiddleware;
