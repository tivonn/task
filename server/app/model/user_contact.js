'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const UserContact = sequelize.define('user_contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'userContact'
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'userContact'
    }
  })

  UserContact.associate = () => {
    sequelize.UserContact.belongsTo(sequelize.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      targetKey: 'id'
    })
    sequelize.UserContact.belongsTo(sequelize.User, {
      as: 'contact',
      foreignKey: 'contactId',
      targetKey: 'id'
    })
  }

  return UserContact
}
