import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate('/edit-profile');
  };

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // giải mã payload (phần giữa JWT)
      return payload;
    } catch (error) {
      console.error('Lỗi giải mã token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const employeeId = localStorage.getItem('employeeId');

        console.log('Token:', token);
        console.log('EmployeeID:', employeeId);

        if (!token || !employeeId) {
          console.log('Thiếu token hoặc employeeId, đá về login');
          navigate('/Login&Register_Form'); // chưa login thì đá về login
          return;
        }

        const decoded = decodeToken(token);
        if (!decoded || !decoded.id) {
          console.error('Token không hợp lệ hoặc thiếu userId');
          navigate('/Login&Register_Form'); // Token lỗi thì cũng đá về login
          return;
        }

        const response = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data);
      } catch (error) {
        console.error('Lỗi lấy thông tin cá nhân:', error);
        navigate('/Login&Register_Form'); // Gặp lỗi là về login luôn
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!employee) {
    return <div>Đang tải thông tin cá nhân...</div>;
  }
  // ✅ Cập nhật đường dẫn ảnh chính xác
  const avatarUrl = employee.avatar ? `http://localhost:9999${employee.avatar}` : `http://localhost:9999/uploads/default.jpg`;
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'null';
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <div className="profile-page">
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>
      <div className="profile-container">
        <h1 className="profile-title">Thông Tin Cá Nhân</h1>
        <div className="profile-card">
          <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
          <h2 className="profile-name">
            {employee.firstName} {employee.lastName}
          </h2>
          <hr className="profile-divider" />
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Phòng ban:</strong> {employee.department?.name || 'Chưa cập nhật'}
          </p>
          <p>
            <strong>Tên công việc:</strong> {employee.position}
          </p>
          <p>
            <strong>Lương:</strong> {employee.salary?.toLocaleString('vi-VN')} VND
          </p>
          <p>
            <strong>Số điện thoại:</strong> {formatPhoneNumber(employee.phone)}
          </p>
          <p>
            <strong>Giới tính:</strong> {employee.gender}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {employee.address}
          </p>
          <p>
            <strong>Vai trò:</strong> {employee.role}
          </p>
          <p>
            <strong>Ngày bắt đầu làm việc:</strong> {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
          </p>
          <button className="edit-profile-btn" onClick={goToEditProfile}>
            Chỉnh sửa thông tin ✏️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
