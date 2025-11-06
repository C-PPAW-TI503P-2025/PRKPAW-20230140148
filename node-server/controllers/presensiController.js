// 1. Ganti sumber data dari array ke model Sequelize
const { Presensi, User } = require("../models"); // Tambahkan User jika perlu include
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    // Ambil id dan nama dari payload JWT (req.user)
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari data menggunakan 'findOne' dari Sequelize
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // Buat data baru, 'nama' tidak lagi disimpan di tabel Presensi
    const newRecord = await Presensi.create({
      userId: userId, //
      checkIn: waktuSekarang,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: userName, // Ambil 'nama' dari token (req.user)
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
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

exports.CheckOut = async (req, res) => {
  try {
    // Ambil id dan nama dari payload JWT (req.user)
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cari data di database
    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // Update dan simpan perubahan ke database
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: userName, // Ambil 'nama' dari token (req.user), bukan recordToUpdate
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
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

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user; // Ambil ID user dari token
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Data Presensi Telah Dihapus." });
    }
    // Pastikan user hanya bisa menghapus data miliknya sendiri
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
  t     .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
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
    // Hapus 'nama' dari destructuring
    const { checkIn, checkOut } = req.body; 

    // Hapus 'nama' dari validasi
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
    // Hapus update 'nama'
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