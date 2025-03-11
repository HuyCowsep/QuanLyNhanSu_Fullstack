import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Notifications.css';
import Swal from 'sweetalert2';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    targetType: 'All',
    departmentId: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('📩 Tất cả thông báo từ API:', response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
      }
    };

    fetchNotifications();
    fetchDepartments();
  }, [token]);

  const handleSendNotification = async () => {
    console.log('🔍 Dữ liệu gửi đi:', newNotification);

    try {
      const response = await axios.post('http://localhost:9999/api/notifications/create', newNotification, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: 'success', // Loại cảnh báo: success, error, warning, info, question
        title: 'Thành công!',
        text: 'Thông báo đã được gửi đi.',
      });
      console.log('📤 Trả về khi gửi thông báo:', response.data);
      setNewNotification({ title: '', message: '', targetType: 'All', departmentId: '' });
    } catch (error) {
      Swal.fire({
        icon: 'error', // Loại cảnh báo: success, error, warning, info, question
        title: 'Có gì đó không ổn!',
        text: 'Lỗi khi gửi thông báo. Vui lòng thử lại.',
      });
    }
  };

  return (
    <div className="notifications-page">
      {/* Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>Gửi thông báo</h1>

      {/* Form gửi thông báo */}
      <div className="notification-form">
        <input type="text" placeholder="Tiêu đề" value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} />
        <textarea placeholder="Nội dung thông báo" value={newNotification.message} onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}></textarea>

        <select value={newNotification.targetType} onChange={(e) => setNewNotification({ ...newNotification, targetType: e.target.value })}>
          <option value="All">Gửi toàn công ty</option>
          <option value="Department">Gửi theo phòng ban</option>
        </select>

        {newNotification.targetType === 'Department' && (
          <select value={newNotification.departmentId} onChange={(e) => setNewNotification({ ...newNotification, departmentId: e.target.value })}>
            <option value="">Chọn phòng ban</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        )}

        <button onClick={handleSendNotification}>Gửi thông báo</button>
      </div>

      <div className="admin-notifications-container">
        <h2>Danh sách thông báo</h2>

        {/* Bảng thông báo toàn công ty */}
        <h3>📢 Thông báo toàn công ty</h3>
        <table className="notification-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Ngày gửi</th>
            </tr>
          </thead>
          <tbody>
            {notifications.filter((n) => n.targetType === 'All').length > 0 ? (
              notifications
                .filter((n) => n.targetType === 'All')
                .map((notification) => (
                  <tr key={notification._id}>
                    <td>{notification.title}</td>
                    <td>{notification.message}</td>
                    <td>{new Date(notification.createdAt).toLocaleString('vi-VN')}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3" className="notification-empty">
                  Không có thông báo chung nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bảng thông báo từng phòng ban */}
        {departments.map((dept) => {
          //đổi hết về string để so sánh vì ở DB là objectID còn ở frontend là string nên không bằng nhau được
          const deptNotifications = notifications.filter((n) => {
            console.log(`🛠 Kiểm tra thông báo: `, n); // Log từng thông báo
            return n.targetType === 'Department' && n.departmentId?.toString() === dept._id.toString();
          });

          return (
            <div key={dept._id} className="department-notifications">
              <h3>🏢 Thông báo của {dept.name}</h3>
              {deptNotifications.length > 0 ? (
                <table className="notification-table">
                  <thead>
                    <tr>
                      <th>Tiêu đề</th>
                      <th>Nội dung</th>
                      <th>Ngày gửi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptNotifications.map((notification) => (
                      <tr key={notification._id}>
                        <td>{notification.title}</td>
                        <td>{notification.message}</td>
                        <td>{new Date(notification.createdAt).toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-department-notifications">{dept.name} chưa có thông báo nào.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNotifications;
