import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Tambahkan useNavigate jika rute gagal

// URL dasar untuk mengakses file statis dari backend Express Anda
const BASE_URL_UPLOADS = 'http://localhost:3001/';

const ReportPage = () => {
  // Penyesuaian state agar mirip Kode 2
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Menggantikan isModalOpen & selectedPhoto
  const navigate = useNavigate(); // Digunakan untuk redirect jika token hilang

  const getToken = () => localStorage.getItem("token");

  // Menggabungkan logika fetch dan filter
  const fetchReports = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setError(null);

    try {
      // Menggunakan endpoint yang sama seperti Kode 1
      const response = await axios.get('http://localhost:3001/api/presensi/report', {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data = response.data.data || [];

      // Filter data di frontend berdasarkan searchTerm
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        data = data.filter((item) =>
          item.user?.nama?.toLowerCase().includes(query)
        );
      }

      setReports(data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data laporan.");
    }
  };

  // Fungsi untuk menjalankan fetchReports saat komponen dimuat atau saat pencarian berubah
  useEffect(() => {
    fetchReports();
  }, [navigate, searchTerm]); // Tambahkan searchTerm sebagai dependency

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(); // Panggil fetchReports untuk menjalankan filter dengan searchTerm terbaru
  };

  // Fungsi untuk menampilkan modal
  const handleImageClick = (photoPath) => {
    // Konversi backslash ke forward slash untuk kompatibilitas URL
    const cleanPath = photoPath.replace(/\\/g, '/');
    const fullUrl = `${BASE_URL_UPLOADS}${cleanPath}`;
    setSelectedImage(fullUrl);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Laporan Presensi User</h2>

      {/* Tambahkan Form Pencarian (mirip Kode 2) */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nama User</th>
              <th className="py-3 px-4 text-left">Waktu Masuk</th>
              <th className="py-3 px-4 text-left">Waktu Keluar</th>
              <th className="py-3 px-4 text-left">Lokasi (Lat, Long)</th>
              <th className="py-3 px-4 text-left">Bukti Foto</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 font-medium">
                    {item.user ? item.user.nama : `User ID: ${item.userId}`}
                  </td>

                  <td className="px-4 py-2">{new Date(item.checkIn).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {item.checkOut ? new Date(item.checkOut).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-2">
                    {item.latitude && item.longitude ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=$${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {item.latitude}, {item.longitude}
                      </a>
                    ) : 'Tidak ada data'}
                  </td>

                  <td className="px-4 py-2">
                    {item.buktiFoto ? (
                      <img
                        src={`${BASE_URL_UPLOADS}${item.buktiFoto.replace(/\\/g, '/')}`}
                        alt="Bukti Presensi"
                        className="w-12 h-12 object-cover rounded-md cursor-pointer hover:opacity-75"
                        onClick={() => handleImageClick(item.buktiFoto)} // Panggil handleImageClick
                      />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada data presensi yang ditemukan atau cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL UNTUK MENAMPILKAN FOTO FULL SIZE (Mirip Kode 2) */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)} // Tutup modal saat klik di luar
        >
          <div className="relative p-4" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Bukti Presensi Penuh"
              className="max-w-full max-h-screen rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;