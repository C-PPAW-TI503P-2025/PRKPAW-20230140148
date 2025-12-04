// presensiController.js

// 1. Import Multer dan Path
const multer = require('multer');
const path = require('path');
const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');
const timeZone = "Asia/Jakarta";

// --- KONFIGURASI MULTER (sesuai modul) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Simpan file ke folder 'uploads/'
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.ext (misal: 1-1700000000000.jpg)
    // req.user.id berasal dari middleware autentikasi sebelumnya
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Hanya izinkan file gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Middleware export untuk digunakan di router (misal: presensiController.upload.single('image'))
exports.upload = multer({ storage: storage, fileFilter: fileFilter });
// --- END KONFIGURASI MULTER ---


exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;

    // 2. Ambil data lokasi dari req.body dan data foto dari req.file
    const { latitude, longitude } = req.body;
    // Konversi backslash ke forward slash untuk kompatibilitas URL
    const buktiFoto = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const waktuSekarang = new Date();

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // 3. Simpan buktiFoto ke database
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto // Simpan path foto ke kolom baru [cite: 98]
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: userName,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
      latitude: newRecord.latitude,
      longitude: newRecord.longitude,
      buktiFoto: newRecord.buktiFoto // Tambahkan buktiFoto ke response
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// CheckOut tidak perlu diubah karena tidak ada pengunggahan file
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: userName,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      latitude: recordToUpdate.latitude,
      longitude: recordToUpdate.longitude,
      buktiFoto: recordToUpdate.buktiFoto // Tambahkan buktiFoto ke response CheckOut
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Fungsi lain (deletePresensi dan updatePresensi) tidak memerlukan Multer atau buktiFoto, 
// jadi tidak perlu diubah.
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Data Presensi Telah Dihapus." });
    }

    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.updatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Data yang dikirim tidak valid.",
      errors: errors.array(),
    });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn atau checkOut).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};