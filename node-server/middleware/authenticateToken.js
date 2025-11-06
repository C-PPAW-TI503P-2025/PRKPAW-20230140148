const jwt = require('jsonwebtoken');
// Ambil secret key yang SAMA persis dengan yang ada di authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authenticateToken = (req, res, next) => {
  // Ambil header 'Authorization'
  const authHeader = req.headers['authorization'];
  // Token biasanya ada di format "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // Tidak ada token
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  // Verifikasi token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token tidak valid atau sudah kedaluwarsa
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token kedaluwarsa." });
      }
      return res.status(403).json({ message: "Token tidak valid." });
    }

    // Jika token valid, simpan payload (data user) ke req.user
    req.user = user;
    next(); // Lanjutkan ke controller
  });
};