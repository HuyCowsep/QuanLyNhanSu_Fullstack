module.exports = (requiredRole) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) {
        return res.status(401).json({ message: "Không được phép - Không tìm thấy vai trò nào" });
      }
      if (userRole !== requiredRole) {
        return res.status(403).json({ message: "Bị cấm - Bạn không đủ quyền" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
};
