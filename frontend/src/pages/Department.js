import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Department.css";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmployeeTable, setShowEmployeeTable] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng ban:", error);
      }
    };

    fetchDepartments();
  }, [token]);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEmployee = async (employeeId) => {
    const result = await Swal.fire({
      title: "⚠️ Xác nhận xóa nhân viên",
      text: "Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/employees/${employeeId}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: "🎉 Thành công!",
          text: "Nhân viên đã được xóa!",
          icon: "success",
          confirmButtonText: "OK",
        });

        setSelectedDepartment((prevState) => ({
          ...prevState,
          employees: prevState.employees.filter((emp) => emp._id !== employeeId),
        }));
      } catch (error) {
        Swal.fire({
          title: "❌ Lỗi!",
          text: "Không thể xóa nhân viên!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleShowEmployeeTable = (dept) => {
    setSelectedDepartment(dept);
    setShowEmployeeTable(true);
  };

  const handleCancelEdit = () => {
    setShowEmployeeTable(false);
    setSelectedDepartment(null);
  };

  return (
  <div className="department-page">
    <div className="department-container">
      <h1 className="page-title">🏢 Danh sách phòng ban</h1>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm phòng ban hoặc trưởng phòng..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredDepartments.map((dept) => (
        <div key={dept._id} className="department-card">
          <div className="department-header">
            <h2>{dept.name}</h2>
            <p><strong>Trưởng phòng:</strong> {dept.manager}</p>
          </div>

          <div className="department-body">
            <p><strong>Mô tả:</strong> {dept.description || "Không có mô tả"}</p>
            <p><strong>Số lượng nhân viên:</strong> {dept.numberOfEmployees}</p>

            <h3>Nhân viên:</h3>
            <ul className="employee-list">
              {dept.employees.map((emp) => (
                <li key={emp._id}>
                  {emp.firstName} {emp.lastName} - {emp.position}
                </li>
              ))}
            </ul>
          </div>

          {role === "admin" && (
            <div className="department-actions">
              {!showEmployeeTable || selectedDepartment?._id !== dept._id ? (
                <button onClick={() => handleShowEmployeeTable(dept)} className="btn-edit">
                  ✏️ Chỉnh sửa
                </button>
              ) : (
                <button onClick={handleCancelEdit} className="btn-cancel">
                  ❌ Hủy
                </button>
              )}
            </div>
          )}

          {showEmployeeTable && selectedDepartment?._id === dept._id && (
            <div className="employee-table">
              <h3>👥 Danh sách nhân viên</h3>
              <table>
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Chức vụ</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.firstName} {emp.lastName}</td>
                      <td>{emp.position}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteEmployee(emp._id)}>
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

};

export default Department;
