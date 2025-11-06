const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/authenticateToken');
router.use(authenticateToken);
const { body } = require('express-validator');
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// BUAT ATURAN VALIDASI INI
const updateValidationRules = [
  body('checkIn')
    .optional() // Hanya validasi jika field ini ada
    .isISO8601() // Pastikan formatnya adalah tanggal ISO8601 (format standar)
    .withMessage('Format tanggal checkIn tidak valid. Gunakan format ISO8601 (YYYY-MM-DDTHH:mm:ss.sssZ).'),
  
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Format tanggal checkOut tidak valid. Gunakan format ISO8601 (YYYY-MM-DDTHH:mm:ss.sssZ).'),
];

// TERAPKAN ATURANNYA DI SINI
router.put(
  "/:id",
  updateValidationRules, // <-- TAMBAHKAN ATURAN INI
  presensiController.updatePresensi
);
router.put('/:id', presensiController.updatePresensi);
router.delete('/:id', presensiController.deletePresensi);
module.exports = router;
