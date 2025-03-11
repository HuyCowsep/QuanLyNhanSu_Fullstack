import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!token || !employeeId) return;

        const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDepartmentId(res.data.department?._id || null);
        setDepartmentName(res.data.department?.name || 'Phòng ban của bạn');
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin nhân viên:', error.response?.data || error.message);
      }
    };

    fetchEmployeeData();
  }, [employeeId, token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!token) return;

        let apiUrl = `http://localhost:9999/api/notifications`;
        if (activeTab === 'department' && departmentId) {
          apiUrl = `http://localhost:9999/api/notifications/${departmentId}`;
        }

        console.log(`📩 Gọi API: ${apiUrl}`);
        const res = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let filteredNotifications = res.data;

        // Chỉ lấy thông báo của phòng ban khi chọn "Thông báo của phòng ban"
        if (activeTab === 'department') {
          filteredNotifications = res.data.filter((notification) => notification.targetType === 'Department' && notification.departmentId === departmentId);
        }
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông báo:', error.response?.data || error.message);
      }
    };

    if (activeTab === 'all' || (activeTab === 'department' && departmentId)) {
      fetchNotifications();
    }
  }, [token, departmentId, activeTab]);

  return (
    <div className="notifications-page">
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>THÔNG BÁO</h1>

      {/* Thanh chọn loại thông báo */}
      <div className="notification-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
          📢 Thông báo Tổng
        </button>
        <button className={activeTab === 'department' ? 'active' : ''} onClick={() => setActiveTab('department')} disabled={!departmentId}>
          🏢 Thông báo của {departmentName}
        </button>
      </div>

      {/* Danh sách thông báo */}
      {notifications.length === 0 ? (
        <p>{activeTab === 'department' ? `📭 ${departmentName} của bạn không có thông báo riêng.` : '📭 Không có thông báo nào.'}</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id} className="notification-card">
            <h2>{notification.title}</h2>
            <p>{notification.message}</p>
            <small>📅 {new Date(notification.createdAt).toLocaleString('vi-VN')}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
