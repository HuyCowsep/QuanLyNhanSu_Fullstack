import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginAndRegister from "./components/LoginAndRegister";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/Login&Register_Form" />} />
        <Route path="/Login&Register_Form" element={<LoginAndRegister />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
