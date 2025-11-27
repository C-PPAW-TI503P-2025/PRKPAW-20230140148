const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { body } = require('express-validator');

// Middleware Auth diterapkan untuk semua route di bawah ini
router.use(authenticateToken);

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// Aturan Validasi
const updateValidationRules = [
  body('checkIn').optional().isISO8601().withMessage('Format tanggal checkIn salah.'),
  body('checkOut').optional().isISO8601().withMessage('Format tanggal checkOut salah.'),
];

// Terapkan validasi di sini
router.put(
  "/:id",
  updateValidationRules, 
  presensiController.updatePresensi
);

// --- BAGIAN INI DIHAPUS SAJA (DUPLIKAT) ---
// router.put('/:id', presensiController.updatePresensi); 

router.delete('/:id', presensiController.deletePresensi);

module.exports = router;