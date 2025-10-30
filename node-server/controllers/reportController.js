// 1. Impor model Presensi dan Operator Sequelize
const { Presensi } = require("../models");
const { Op } = require("sequelize");

// 2. Ubah fungsi menjadi async
exports.getDailyReport = async (req, res) => {
  try {
    // 3. Ambil query parameters dari URL
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    // 4. Siapkan 'options' untuk query Sequelize
    let options = {
      where: {},
      order: [["checkIn", "DESC"]], // (Opsional: mengurutkan data)
    };

    // 5. Tambahkan filter nama (dari modul praktikum)
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // 6. Tambahkan filter rentang tanggal (sesuai tugas)
    if (tanggalMulai && tanggalSelesai) {
      // Kita asumsikan filter berdasarkan tanggal checkIn
      options.where.checkIn = {
        [Op.between]: [
          new Date(tanggalMulai), // Tanggal mulai
          new Date(tanggalSelesai + "T23:59:59"), // Tanggal selesai (sampai akhir hari)
        ],
      };
    }

    // 7. Ambil data dari database menggunakan Sequelize
    const records = await Presensi.findAll(options);

    // 8. Kembalikan data sebagai JSON
    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });

  } catch (error) {
    // 9. Tambahkan error handling
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};