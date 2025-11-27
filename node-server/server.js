const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; // Port harus sama dengan yang dipanggil di React

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Supaya bisa baca JSON dari React

// --- IMPORT ROUTE (LOGIKA ASLI) ---
// Kita bungkus dalam try-catch supaya kalau file tidak ada, errornya jelas
try {
  const authRoute = require('./routes/auth');
  const presensiRoute = require('./routes/presensi');

  // --- DAFTARKAN ROUTE ---
  // 1. Route Auth (Login/Register) -> Mengarah ke routes/auth.js
  app.use('/api/auth', authRoute);

  // 2. Route Presensi (Check-in/Out) -> Mengarah ke routes/presensi.js
  app.use('/api/presensi', presensiRoute);

} catch (error) {
  console.error("❌ GAGAL MEMUAT ROUTE:", error.message);
  console.error("Pastikan file 'routes/auth.js' dan 'routes/presensi.js' sudah ada dan kodenya benar.");
}

// --- ROUTE DEFAULT (CEK KONEKSI) ---
// Route ini untuk memastikan server hidup saat dibuka di browser (http://localhost:3001/)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server API berjalan dengan baik!',
    status: 'Connected',
    time: new Date()
  });
});

// --- JALANKAN SERVER ---
app.listen(port, () => {
  console.log(`==================================================`);
  console.log(`🚀 Backend Server running on http://localhost:${port}`);
  console.log(`   - Auth Route: http://localhost:${port}/api/auth/login`);
  console.log(`   - Presensi Route: http://localhost:${port}/api/presensi/check-in`);
  console.log(`==================================================`);
});