import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import {
  FaUser,
  FaClipboardList,
  FaBell,
  FaMoneyBillWave,
  FaPlane,
  FaFileAlt,
  FaDatabase,
  FaSignOutAlt,
  FaBuilding,
  FaCogs,
  FaUsers,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import Profile from "./Profile";
import Attendance from "./Attendance";
import EditProfile from "./EditProfile";
import Department from "./Department";
import Leave from "./Leave";
import Notifications from "./Notifications";
import Salary from "./Salary";
import AdminNotifications from "./AdminNotifications";
import AdminAttendance from "./AdminAttendance";
import AdminDepartment from "./AdminDepartment";
import AdminSalary from "./AdminSalary";
import AdminLeave from "./AdminLeave";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  const role = localStorage.getItem("role");
  console.log("Role:", role);
  const employeeId = localStorage.getItem("employeeId");
  console.log("EmployeeId:", employeeId);

  const [employeeName, setEmployeeName] = useState("");
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalPayrolls, setTotalPayrolls] = useState(0);
  const [remainingLeaveDays, setRemainingLeaveDays] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      console.log("No token, redirecting to login");
      window.location.href = "/Login&Register_Form";
      return;
    }

    if (role !== "admin" && employeeId) {
      const fetchEmployeeName = async () => {
        try {
          const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data) {
            const { firstName, lastName } = res.data;
            setEmployeeName(firstName && lastName ? `${firstName} ${lastName}` : "Employee");
          }
        } catch (error) {
          console.error("Error fetching employee name:", error);
          setEmployeeName("Employee");
          if (error.response?.status === 401) {
            setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            localStorage.clear();
            setTimeout(() => {
              window.location.href = "/Login&Register_Form";
            }, 2000);
          }
        }
      };
      fetchEmployeeName();
    }
  }, [role, employeeId, token]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const employeesRes = await axios.get("http://localhost:9999/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalEmployees(employeesRes.data.length);

        const departmentsRes = await axios.get("http://localhost:9999/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalDepartments(departmentsRes.data.length);

        let payrollsRes;
        if (role === "admin") {
          payrollsRes = await axios.get("http://localhost:9999/api/payroll/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (employeeId) {
          payrollsRes = await axios.get(`http://localhost:9999/api/payroll/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          payrollsRes = { data: [] };
        }
        setTotalPayrolls(payrollsRes.data.length);

        if (role !== "admin" && employeeId) {
          const leaveRes = await axios.get(`http://localhost:9999/api/leaves/remaining/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRemainingLeaveDays(leaveRes.data.remainingLeaveDays);
        }

        const notificationsRes = await axios.get("http://localhost:9999/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentNotifications(notificationsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          localStorage.clear();
          setTimeout(() => {
            window.location.href = "/Login&Register_Form";
          }, 2000);
        } else {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        }
      }
    };
    fetchDashboardData();
  }, [role, employeeId, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="dashboard-content">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      );
    }

    switch (activeSection) {
      case "overview":
        return (
          <div className="dashboard-content">
            <h1>Welcome, {role === "admin" ? "Admin" : employeeName || "Employee"}</h1>
            <hr style={{ margin: "20px", border: "1px solid blue" }} />
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
              {role !== "admin" && remainingLeaveDays !== null && (
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
                <span className="shake-blink-bell">🔔</span> Tóm Tắt Thông Báo Gần Đây
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
        );
      case "profile":
        return <Profile setActiveSection={setActiveSection} />;
      case "attendance":
        return role === "admin" ? <AdminAttendance /> : <Attendance />;
      case "edit-profile":
        return <EditProfile setActiveSection={setActiveSection} />;
      case "department":
        return <Department />;
      case "leave":
        return role === "admin" ? <AdminLeave /> : <Leave />;
      case "notifications":
        return role === "admin" ? <AdminNotifications /> : <Notifications />;
      case "salary":
        return role === "admin" ? <AdminSalary /> : <Salary />;
      case "admin-department":
        return <AdminDepartment />;
      case "reports":
        return <div>Reports - Chưa triển khai</div>;
      case "backup":
        return <div>Backup - Chưa triển khai</div>;
      default:
        return <div>Chọn một mục từ menu để xem nội dung.</div>;
    }
  };

  if (!token) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="menu">
        <ul className="menu-content">
          {role !== "admin" && (
            <li>
              <a
                href="#profile"
                className={activeSection === "profile" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("profile");
                }}
              >
                <span className="icon-wrapper">
                  <FaUser />
                </span>
                <span className="text">Profile</span>
              </a>
            </li>
          )}
          <li>
            <a
              href="#attendance"
              className={activeSection === "attendance" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("attendance");
              }}
            >
              <span className="icon-wrapper">
                <FaClipboardList />
              </span>
              <span className="text">Attendance</span>
            </a>
          </li>
          <li>
            <a
              href="#notifications"
              className={activeSection === "notifications" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("notifications");
              }}
            >
              <span className="icon-wrapper">
                <FaBell />
              </span>
              <span className="text">Notification</span>
            </a>
          </li>
          <li>
            <a
              href="#salary"
              className={activeSection === "salary" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("salary");
              }}
            >
              <span className="icon-wrapper">
                <FaMoneyBillWave />
              </span>
              <span className="text">Salary</span>
            </a>
          </li>
          <li>
            <a
              href="#leave"
              className={activeSection === "leave" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("leave");
              }}
            >
              <span className="icon-wrapper">
                <FaPlane />
              </span>
              <span className="text">Leave</span>
            </a>
          </li>
          <li>
            <a
              href="#reports"
              className={activeSection === "reports" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("reports");
              }}
            >
              <span className="icon-wrapper">
                <FaFileAlt />
              </span>
              <span className="text">Reports</span>
            </a>
          </li>
          <li>
            <a
              href="#backup"
              className={activeSection === "backup" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("backup");
              }}
            >
              <span className="icon-wrapper">
                <FaDatabase />
              </span>
              <span className="text">Backup</span>
            </a>
          </li>
          <li>
            <a
              href="#department"
              className={activeSection === "department" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("department");
              }}
            >
              <span className="icon-wrapper">
                <FaBuilding />
              </span>
              <span className="text">Department</span>
            </a>
          </li>
          {role === "admin" && (
            <li>
              <a
                href="#admin-department"
                className={activeSection === "admin-department" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("admin-department");
                }}
              >
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
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;