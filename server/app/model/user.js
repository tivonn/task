'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '姓名'
    },
    imcode: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'im号'
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '账号'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '密码'
    }
  }, {
    timestamps: false
  })
  return User
}
