import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { FaUser, FaClipboardList, FaBell, FaMoneyBillWave, FaRegMoneyBillAlt, FaPlane, FaFileAlt, FaDatabase, FaSignOutAlt, FaBuilding, FaCogs, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const employeeId = localStorage.getItem('employeeId');

  const [employeeName, setEmployeeName] = useState('');
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalPayrolls, setTotalPayrolls] = useState(0);
  const [remainingLeaveDays, setRemainingLeaveDays] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (role !== 'admin' && employeeId) {
      const fetchEmployeeName = async () => {
        try {
          const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data) {
            const { firstName, lastName } = res.data;
            setEmployeeName(firstName && lastName ? `${firstName} ${lastName}` : 'Employee');
          }
        } catch (error) {
          setEmployeeName('Employee');
        }
      };

      fetchEmployeeName();
    }
  }, [role, employeeId]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Gọi API danh sách nhân viên
        const employeesRes = await axios.get('http://localhost:9999/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalEmployees(employeesRes.data.length);

        // Gọi API danh sách phòng ban
        const departmentsRes = await axios.get('http://localhost:9999/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalDepartments(departmentsRes.data.length);

        // Gọi API danh sách bảng lương
        let payrollsRes;
        if (role === 'admin') {
          payrollsRes = await axios.get('http://localhost:9999/api/payroll/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          payrollsRes = await axios.get(`http://localhost:9999/api/payroll/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        setTotalPayrolls(payrollsRes.data.length);

        // Gọi API lấy số ngày nghỉ phép còn lại (chỉ nhân viên)
        if (role !== 'admin') {
          const leaveRes = await axios.get(`http://localhost:9999/api/leaves/remaining/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRemainingLeaveDays(leaveRes.data.remainingLeaveDays);
        }

        // Gọi API danh sách thông báo
        const notificationsRes = await axios.get('http://localhost:9999/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentNotifications(notificationsRes.data.slice(0, 5)); // Lấy 5 thông báo gần nhất
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchDashboardData();
  }, [role, employeeId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="menu">
        <ul className="menu-content">
          {role !== 'admin' && (
            <li>
              <a href="/profile">
                <span className="icon-wrapper">
                  <FaUser />
                </span>
                <span className="text">Profile</span>
              </a>
            </li>
          )}
          <li>
            <a href="/attendance">
              <span className="icon-wrapper">
                <FaClipboardList />
              </span>
              <span className="text">Attendance</span>
            </a>
          </li>
          <li>
            <a href="/notifications">
              <span className="icon-wrapper">
                <FaBell />
              </span>
              <span className="text">Notification</span>
            </a>
          </li>
          <li>
            <a href="/salary">
              <span className="icon-wrapper">
                <FaMoneyBillWave />
              </span>
              <span className="text">Salary</span>
            </a>
          </li>
          <li>
            <a href="/leave">
              <span className="icon-wrapper">
                <FaPlane />
              </span>
              <span className="text">Leave</span>
            </a>
          </li>
          <li>
            <a href="/reports">
              <span className="icon-wrapper">
                <FaFileAlt />
              </span>
              <span className="text">Reports</span>
            </a>
          </li>
          <li>
            <a href="/backup">
              <span className="icon-wrapper">
                <FaDatabase />
              </span>
              <span className="text">Backup</span>
            </a>
          </li>
          <li>
            <a href="/department">
              <span className="icon-wrapper">
                <FaBuilding />
              </span>
              <span className="text">Department</span>
            </a>
          </li>
          {role === 'admin' && (
            <li>
              <a href="/admin-department">
                <span className="icon-wrapper">
                  <FaCogs />
                </span>
                <span className="text">Manage Departments</span>
              </a>
            </li>
          )}
          <li>
            <a href="/Login&Register_Form" onClick={handleLogout}>
              <span className="icon-wrapper">
                <FaSignOutAlt />
              </span>
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="dashboard-content">
        <h1>Welcome, {role === 'admin' ? 'Admin' : employeeName || 'Employee'}</h1>
        <hr style={{ margin: '20px', border: '1px solid blue' }}></hr>
        <h2>📊 Tổng Quan Hệ Thống</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>{totalEmployees}</h3>
              <p>Số nhân viên</p>
            </div>
          </div>

          <div className="stat-card">
            <FaRegMoneyBillAlt className="stat-icon" />
            <div className="stat-info">
              <h3>{totalPayrolls}</h3>
              <p>Số bảng lương</p>
            </div>
          </div>

          <div className="stat-card">
            <FaClipboardList className="stat-icon" />
            <div className="stat-info">
              <h3>{totalDepartments}</h3>
              <p>Số phòng ban</p>
            </div>
          </div>

          {role !== 'admin' && remainingLeaveDays !== null && (
            <div className="stat-card">
              <FaPlane className="stat-icon" />
              <div className="stat-info">
                <h3>{remainingLeaveDays}</h3>
                <p>Số ngày nghỉ còn lại</p>
              </div>
            </div>
          )}
        </div>

        <div className="recent-notifications">
          <h2>
            <span class="shake-blink-bell">🔔</span> Tóm Tắt Thông Báo Gần Đây
          </h2>
          <small className="recent-notifications-small">(Bạn cần phải xem chi tiết thông báo tại mục riêng)</small>
          <ul>
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notif, index) => (
                <li key={index}>
                  <FaBell className="notif-icon" /> {notif.title}
                </li>
              ))
            ) : (
              <p>Không có thông báo mới.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
