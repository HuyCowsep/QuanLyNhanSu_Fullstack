import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Leave.css";

const AdminLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn nghỉ phép:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: "Xác nhận cập nhật",
      text: `Bạn chắc chắn muốn chuyển trạng thái đơn này thành "${status.toLowerCase()}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cập nhật!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:9999/api/leaves/${id}/update`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Thành công!", `Đơn nghỉ phép đã được ${status.toLowerCase()}!`, "success");
        fetchLeaves();
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể cập nhật đơn nghỉ phép!", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/leaves/${id}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Đã xóa!", "Đơn nghỉ phép đã bị xóa.", "success");
        fetchLeaves();
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa đơn nghỉ phép!", "error");
      }
    }
  };

  return (
    <div className="leave-page">
      <h1>Quản Lý Nghỉ Phép</h1>
      <table className="leave-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Chức vụ</th>
            <th>Phòng ban</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Lý do</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>
                {leave.employeeId?.firstName} {leave.employeeId?.lastName}
              </td>
              <td>{leave.employeeId?.position}</td>
              <td>{leave.employeeId?.department?.name}</td>
              <td>{new Date(leave.startDate).toLocaleDateString("vi-VN")}</td>
              <td>{new Date(leave.endDate).toLocaleDateString("vi-VN")}</td>
              <td>{leave.reason}</td>
              <td className={`leave-status ${leave.status.toLowerCase().replace(" ", "-")}`}>{leave.status}</td>
              <td>
                {leave.status === "Chờ duyệt" && (
                  <>
                    <button className="approve-btn" onClick={() => handleUpdateStatus(leave._id, "Đã duyệt")}>
                      ✔ Duyệt
                    </button>
                    <button className="reject-btn" onClick={() => handleUpdateStatus(leave._id, "Từ chối")}>
                      ✖ Từ chối
                    </button>
                  </>
                )}
                <button className="delete-btn" onClick={() => handleDelete(leave._id)}>
                  🗑 Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeave;
