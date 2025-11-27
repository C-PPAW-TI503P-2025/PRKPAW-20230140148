import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [dataPresensi, setDataPresensi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Pastikan endpoint ini ada di backend Anda
        const response = await axios.get('http://localhost:3000/api/presensi', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Sesuaikan dengan struktur response backend Anda (misal response.data.data)
        setDataPresensi(response.data.data || []); 
      } catch (error) {
        console.error("Gagal mengambil data report", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Laporan Presensi User</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">User ID</th>
              <th className="py-3 px-4 text-left">Waktu Masuk</th>
              <th className="py-3 px-4 text-left">Waktu Keluar</th>
              <th className="py-3 px-4 text-left">Lokasi (Lat, Long)</th>
            </tr>
          </thead>
          <tbody>
            {dataPresensi.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{item.userId}</td>
                <td className="py-3 px-4">{new Date(item.checkIn).toLocaleString()}</td>
                <td className="py-3 px-4">
                  {item.checkOut ? new Date(item.checkOut).toLocaleString() : '-'}
                </td>
                <td className="py-3 px-4">
                  {item.latitude && item.longitude ? (
                    <a 
                      href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.latitude}, {item.longitude}
                    </a>
                  ) : 'Tidak ada data'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;