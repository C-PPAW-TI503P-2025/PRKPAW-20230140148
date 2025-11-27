import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Gagal decode token", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Cek apakah user adalah admin
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-lg shadow-md text-center w-full max-w-2xl">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Selamat Datang, <span className="font-semibold text-blue-600">{user ? user.nama : 'User'}</span>!
        </p>

        {/* Container Tombol Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Tombol Ke Halaman Presensi (Semua User) */}
          <button
            onClick={() => navigate('/presensi')}
            className="py-4 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex flex-col items-center justify-center"
          >
            <span className="text-xl mb-1">📅</span>
            Isi Presensi
          </button>

          {/* Tombol Ke Halaman Laporan (Hanya Admin) */}
          {isAdmin && (
            <button
              onClick={() => navigate('/reports')}
              className="py-4 px-6 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-200 flex flex-col items-center justify-center"
            >
              <span className="text-xl mb-1">📊</span>
              Laporan Admin
            </button>
          )}
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full md:w-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;