import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Set default role sesuai permintaan
  const [role, setRole] = useState('mahasiswa'); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 
    setSuccess(null);

    try {
      // Endpoint sesuai permintaan tugas (pastikan backend berjalan di port 3001)
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name: name,
        email: email,
        password: password,
        role: role // Kirim role
      });

      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman Login.');
      
      // Arahkan ke halaman login setelah registrasi sukses
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Tunda 2 detik

    } catch (err) {
      // Tangani error dari server (misalnya email sudah terdaftar)
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Daftar Akun Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Nama */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700"
            >
              Nama:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Role (Dropdown/Select) */}
          <div>
            <label 
              htmlFor="role" 
              className="block text-sm font-medium text-gray-700"
            >
              Role:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Daftar
          </button>
        </form>

        {/* Pesan Error dan Sukses */}
        {error && (
          <p className="text-red-600 text-sm mt-6 text-center p-3 bg-red-100 border border-red-300 rounded-md">
            ⚠️ {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm mt-6 text-center p-3 bg-green-100 border border-green-300 rounded-md">
            🎉 {success}
          </p>
        )}
        
        {/* Link ke Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun? 
          <button 
            onClick={() => navigate('/login')} 
            className="text-blue-600 hover:text-blue-800 font-medium ml-1"
          >
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage; // <--- PASTIKAN INI ADALAH DEFAULT EXPORT!