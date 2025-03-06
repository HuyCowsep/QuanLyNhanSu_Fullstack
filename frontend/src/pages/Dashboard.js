import React from "react";
import "../styles/Dashboard.css";
import { FaUser, FaClipboardList, FaBell, FaMoneyBillWave, FaPlane, FaFileAlt, FaDatabase, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItems = [
    { icon: <FaUser />, text: "Thông tin cá nhân" },
    { icon: <FaClipboardList />, text: "Điểm danh" },
    { icon: <FaBell />, text: "Thông báo" },
    { icon: <FaMoneyBillWave />, text: "Bảng lương" },
    { icon: <FaPlane />, text: "Nghỉ phép" },
    { icon: <FaFileAlt />, text: "Báo cáo" },
    { icon: <FaDatabase />, text: "Sao lưu/phục hồi" },
    { icon: <FaSignOutAlt />, text: "Đăng xuất", action: handleLogout },
  ];

  return (
    <div className="dashboard-container">
      <div className="menu">
        <ul className="menu-content">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href="#" onClick={item.action}>
                <span className="icon-wrapper">{item.icon}</span>
                <span className="text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="dashboard-content">
        <h1>Chào mừng nhân viên</h1>
      </div>
    </div>
  );
};

export default Dashboard;
