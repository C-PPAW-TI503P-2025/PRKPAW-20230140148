import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Navbar from './components/NavBar'; 
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/RegisterPage'; 
function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Tambahkan Route Dashboard di sini */}
          <Route path="/dashboard" element={<DashboardPage />} /> 

          <Route path="/presensi" element={<PresensiPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;