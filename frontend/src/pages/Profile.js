import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = ({ setActiveSection }) => {
  const [employee, setEmployee] = useState(null);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const employeeId = localStorage.getItem("employeeId");

        if (!token || !employeeId) {
          window.location.href = "/Login&Register_Form";
          return;
        }

        const decoded = decodeToken(token);
        if (!decoded || !decoded.id) {
          window.location.href = "/Login&Register_Form";
          return;
        }

        const response = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin cá nhân:", error);
        window.location.href = "/Login&Register_Form";
      }
    };

    fetchProfile();
  }, []);

  if (!employee) {
    return <div className="profile-page">Đang tải thông tin cá nhân...</div>;
  }

  const avatarUrl = employee.avatar
    ? `http://localhost:9999${employee.avatar}`
    : `http://localhost:9999/uploads/default.jpg`;
  const formatPhoneNumber = (phone) => {
    if (!phone) return "null";
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  return (
    <div className="profile-page">
        <h1 className="profile-title">Thông Tin Cá Nhân</h1>
        <div className="profile-card">
          <div className="profile-header">
            <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
            <h2 className="profile-name">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="profile-role">{employee.role}</p>
          </div>
          <hr className="profile-divider" />
          <div className="profile-details">
            <div className="profile-info">
              <span className="info-label">Email:</span>
              <span className="info-value">{employee.email}</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Phòng ban:</span>
              <span className="info-value">{employee.department?.name || "Chưa cập nhật"}</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Tên công việc:</span>
              <span className="info-value">{employee.position}</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Lương:</span>
              <span className="info-value">{employee.salary?.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Số điện thoại:</span>
              <span className="info-value">{formatPhoneNumber(employee.phone)}</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Giới tính:</span>
              <span className="info-value">{employee.gender}</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Ngày sinh:</span>
              <span className="info-value">
                {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
              </span>
            </div>
            <div className="profile-info">
              <span className="info-label">Địa chỉ:</span>
              <span className="info-value">{employee.address}</span>
            </div>
            <div className="profile-info">
              <span className="info-label">Ngày bắt đầu làm việc:</span>
              <span className="info-value">
                {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
              </span>
            </div>
          </div>
          <button className="edit-profile-btn" onClick={() => setActiveSection("edit-profile")}>
            Chỉnh sửa thông tin ✏️
          </button>
        </div>
    </div>
  );
};

export default Profile;
