import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';
import Swal from 'sweetalert2';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    department: '',
    position: '',
    email: '',
    role: '',
    salary: 0,
    hireDate: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const navigate = useNavigate();

  const departments = [
    { id: '67c72871778523d0435cc231', name: 'Phòng Công nghệ thông tin' },
    { id: '67c73770b9e4506e85c85de1', name: 'Phòng Nhân sự' },
    { id: '67c7386ab9e4506e85c85de9', name: 'Phòng Marketing' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const employeeId = localStorage.getItem('employeeId');

      if (!token || !employeeId) {
        navigate('/Login&Register_Form');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { firstName, lastName, dateOfBirth, gender, address, phone, department, position, email, role, salary, hireDate, avatar } = res.data;

        setFormData({
          firstName,
          lastName,
          dateOfBirth: dateOfBirth ? dateOfBirth.split('T')[0] : '',
          gender,
          address,
          phone,
          department: department?._id || '',
          position,
          email,
          role,
          salary,
          hireDate,
        });
        if (avatar) {
          setAvatarUrl(`http://localhost:9999${avatar}`); // Nếu user đã có avatar thì hiển thị
        }
      } catch (error) {
        console.error('Lỗi tải thông tin:', error);
        navigate('/Login&Register_Form');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên

    if (file) {
      setAvatar(file); // Chỉ cần dùng một state là đủ
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatar) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo!',
        text: 'Bạn chưa chọn ảnh!',
      });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    const token = localStorage.getItem('token');
    const employeeId = localStorage.getItem('employeeId');

    try {
      const res = await axios.post(`http://localhost:9999/api/employees/${employeeId}/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Avatar đã được cập nhật!',
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể upload avatar!',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const employeeId = localStorage.getItem('employeeId');

    try {
      await axios.put(`http://localhost:9999/api/employees/${employeeId}/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: 'success', // Loại cảnh báo: success, error, warning, info, question
        title: 'Thành công!',
        text: 'Cập nhật thông tin thành công!',
      });
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      Swal.fire({
        icon: 'error', // Loại cảnh báo: success, error, warning, info, question
        title: 'Lỗi!',
        text: 'Cập nhật thông tin thất bại!',
      });
    }
  };

  return (
    <div className="edit-profile-container">
      {/* 🔥 Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h2>Edit personal information</h2>

      <div className="avatar-container">
        <img src={avatarUrl} alt="Avatar" className="avatar-preview" />

        {/* Nút chọn file đẹp hơn */}
        <label htmlFor="file-upload" className="file-label">
          Chọn ảnh
        </label>
        <input id="file-upload" type="file" accept="image/*" className="file-input" onChange={handleFileChange} />

        {/* Hiển thị tên file đã chọn */}
        <span className="file-name">{avatar ? avatar.name : 'Chưa có ảnh'}</span>

        <button type="button" onClick={handleUploadAvatar} className="upload-btn">
          Upload Avatar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label>Họ:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Tên:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Ngày sinh:</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Giới tính:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="text" name="email" value={formData.email} disabled className="form-input disabled" />
        </div>
        <div className="form-group">
          <label>Địa chỉ:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Phòng ban:</label>
          <select name="department" value={formData.department} onChange={handleChange} className="form-select">
            <option value="">Chọn phòng ban</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Tên công việc:</label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Vai trò:</label>
          <input type="text" name="role" value={formData.role} disabled className="form-input disabled" />
        </div>
        <div className="form-group">
          <label>Ngày bắt đầu làm việc:</label>
          <input type="text" value={formData.hireDate ? new Date(formData.hireDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'} disabled className="form-input disabled" />
        </div>

        <button type="submit" className="submit-btn">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
