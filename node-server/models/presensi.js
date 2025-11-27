'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId', 
        as: 'user' 
      });
    }
  }
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // --- TAMBAHAN KOLOM LOKASI ---
    latitude: {
      type: DataTypes.DECIMAL(10, 8), // Menyimpan angka desimal presisi tinggi
      allowNull: true, // Boleh kosong jika user menolak izin lokasi
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    // -----------------------------
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true, 
    }
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};