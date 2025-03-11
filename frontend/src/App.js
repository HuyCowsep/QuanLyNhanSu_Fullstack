import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAndRegister from './components/LoginAndRegister';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Attendance from './pages/Attendance';
import AdminAttendance from './pages/AdminAttendace';
import Department from './pages/Department';
import AdminDepartment from './pages/AdminDepartment';
import Notifications from './pages/Notifications';
import AdminNotifications from './pages/AdminNotifications';
import Leave from './pages/Leave';
import AdminLeave from './pages/AdminLeave';
import Salary from './pages/Salary';
import AdminSalary from './pages/AdminSalary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login&Register_Form" replace />} />
        <Route path="/Login&Register_Form" element={<LoginAndRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/attendance" element={localStorage.getItem('role') === 'admin' ? <AdminAttendance /> : <Attendance />} />
        <Route path="/department" element={<Department />} />
        <Route path="/admin-department" element={<AdminDepartment />} />
        <Route path="/notifications" element={localStorage.getItem('role') === 'admin' ? <AdminNotifications /> : <Notifications />} />
        <Route path="/notifications/:id" element={<Notifications />} />
        <Route path="/leave" element={localStorage.getItem('role') === 'admin' ? <AdminLeave /> : <Leave />} />
        <Route path="/salary" element={localStorage.getItem('role') === 'admin' ? <AdminSalary /> : <Salary />} />
      </Routes>
    </Router>
  );
}

export default App;
