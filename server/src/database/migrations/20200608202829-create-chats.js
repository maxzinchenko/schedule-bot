module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Chats', {
      id: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
      },

      role: {
        type: Sequelize.ENUM('admin', 'moderator', 'user', 'outcast'),
        defaultValue: 'user',
        allowNull: false
      },

      group: {
        type: Sequelize.STRING,
        allowNull: true
      },

      lecturer: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Chats');
  }
};
