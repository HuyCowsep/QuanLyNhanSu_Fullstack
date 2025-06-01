import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!token || !employeeId) return;

        const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDepartmentId(res.data.department?._id || null);
        setDepartmentName(res.data.department?.name || "Phòng ban của bạn");
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin nhân viên:", error.response?.data || error.message);
      }
    };

    fetchEmployeeData();
  }, [employeeId, token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!token) return;

        let apiUrl = `http://localhost:9999/api/notifications`;
        if (activeTab === "department" && departmentId) {
          apiUrl = `http://localhost:9999/api/notifications/${departmentId}`;
        }

        const res = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let filteredNotifications = res.data;
        if (activeTab === "department") {
          filteredNotifications = res.data.filter(
            (notification) => notification.targetType === "Department" && notification.departmentId === departmentId
          );
        }
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông báo:", error.response?.data || error.message);
      }
    };

    if (activeTab === "all" || (activeTab === "department" && departmentId)) {
      fetchNotifications();
    }
  }, [token, departmentId, activeTab]);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>THÔNG BÁO</h1>
        <div className="notification-tabs">
          <button
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => setActiveTab('all')}
          >
            📢 Thông báo Tổng
          </button>
          <button
            className={activeTab === 'department' ? 'active' : ''}
            onClick={() => setActiveTab('department')}
            disabled={!departmentId}
          >
            🏢 Thông báo của {departmentName}
          </button>
        </div>
      </div>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>
              {activeTab === 'department' ? `📭 ${departmentName} của bạn không có thông báo riêng.` : '📭 Không có thông báo nào.'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <div className="notification-content">
                <h2>{notification.title}</h2>
                <p>{notification.message}</p>
              </div>
              <div className="notification-meta">
                <small>📅 {new Date(notification.createdAt).toLocaleString('vi-VN')}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
