import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAndRegister from "./components/LoginAndRegister";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAndRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
