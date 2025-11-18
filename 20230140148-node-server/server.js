const express = require('express');
const cors = require('cors'); // Tambahkan paket cors
const app = express();
// Ubah port agar sesuai dengan yang Anda gunakan di frontend (3001)
// TAPI, jika backend Anda di 3001, pastikan frontend Anda tidak di 3001 juga. 
// Berdasarkan kode frontend Anda, endpoint yang digunakan adalah http://localhost:3001
const port = 3001; 

// --- MIDDLEWARE PENTING UNTUK API ---

// 1. Middleware CORS: Mengizinkan frontend (misalnya di port 3000) untuk mengakses backend ini.
app.use(cors());

// 2. Middleware JSON: Mengizinkan server membaca body dari request sebagai JSON (untuk data login/register)
app.use(express.json());

// --- IMPLEMENTASI ROUTING API ---

// Dummy Route API Auth (Anda perlu mengganti ini dengan Auth Router yang sebenarnya)
// Jika Anda belum punya file router, buat folder 'routes' dan file 'auth.js'
const authRouter = express.Router();

// Ini hanya contoh dummy agar server tidak error saat dihubungi.
// Anda HARUS mengganti ini dengan logika registrasi/login yang sebenarnya.
authRouter.post('/register', (req, res) => {
    // Di sini akan ada logika koneksi database, validasi, dan hashing password
    // Data yang dikirim dari frontend ada di req.body
    console.log('Data Register Diterima:', req.body);
    res.status(201).json({ 
        message: 'Registrasi berhasil (Simulasi)', 
        user: { name: req.body.name, email: req.body.email }
    });
});

authRouter.post('/login', (req, res) => {
    // Di sini akan ada logika cek database dan buat token
    console.log('Data Login Diterima:', req.body);
    // Ini token dummy untuk membuat frontend bisa redirect ke dashboard
    res.status(200).json({ 
        message: 'Login berhasil (Simulasi)', 
        token: 'dummy-jwt-token-12345' 
    });
});

// Gunakan router di prefix /api/auth
// Sehingga endpoint menjadi http://localhost:3001/api/auth/register dan /api/auth/login
app.use('/api/auth', authRouter); 

// Route Default untuk uji coba
app.get('/', (req, res) => {
  res.json({ message: 'Server API berjalan dengan baik!' });
});

// --- MENJALANKAN SERVER ---
app.listen(port, () => {
  console.log(`🚀 Backend Server running on http://localhost:${port}`);
  console.log('Pastikan Anda sudah menginstal paket: express, cors, dan body-parser (jika perlu)');
});