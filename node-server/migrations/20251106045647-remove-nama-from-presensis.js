'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menghapus kolom 'nama' dari tabel 'Presensis'
    await queryInterface.removeColumn('Presensis', 'nama');
  },

  async down (queryInterface, Sequelize) {
    // Menambahkan kembali kolom 'nama' jika migrasi di-rollback
    await queryInterface.addColumn('Presensis', 'nama', {
      type: Sequelize.STRING,
      allowNull: false 
    });
  }
};