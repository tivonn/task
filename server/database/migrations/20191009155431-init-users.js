'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'id'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '姓名'
      },
      imcode: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'im号'
      },
      account: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '账号'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '密码'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
