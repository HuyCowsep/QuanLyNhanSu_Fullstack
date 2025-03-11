import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { FaUser, FaClipboardList, FaBell, FaMoneyBillWave, FaPlane, FaFileAlt, FaDatabase, FaSignOutAlt, FaBuilding, FaCogs } from 'react-icons/fa';

const Dashboard = () => {
  const [employeeName, setEmployeeName] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    if (role !== 'admin' && employeeId) {
      const fetchEmployeeName = async () => {
        try {
          const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data) {
            const { firstName, lastName } = res.data;
            const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'Employee';

            setEmployeeName(fullName);
          }
        } catch (error) {
          setEmployeeName('Employee'); //không có thì mặc định là employee
        }
      };

      fetchEmployeeName();
    }
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
      </div>
    </div>
  );
};

export default Dashboard;
