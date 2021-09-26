'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      publicationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          models: "publication",
          key: "id"
        }
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          models: "user",
          key: "id"
        }
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updateAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comments');
  }
};