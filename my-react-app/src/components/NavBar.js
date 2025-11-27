// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Mendekode token untuk mendapatkan payload user
                const decoded = jwtDecode(token);
                setUser(decoded); // Payload token berisi { id, nama, email, role }
            } catch (error) {
                console.error("Token decoding failed:", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        // Hapus token dari localStorage
        localStorage.removeItem('token');
        setUser(null);
        // Navigasi ke halaman /login
        navigate('/login');
    };

    // Tampilkan tautan hanya jika user memiliki token
    const isAuthenticated = user !== null;
    const isAdmin = isAuthenticated && user.role === 'admin';

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">
                    Presensi App
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-white">
                                Halo, {user.nama}! {/* Tampilkan nama dari token */}
                            </span>
                            
                            <Link to="/presensi" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Presensi
                            </Link>

                            {/* Tampilkan menu 'Laporan Admin' hanya jika role = 'admin' */}
                            
                                <Link to="/reports" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Laporan Admin
                                </Link>
                            
                            
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Registrasi
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;