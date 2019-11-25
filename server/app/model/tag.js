'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const Tag = sequelize.define('tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
      comment: '名称'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'creator_id',
      comment: '创建人id'
    }
  })

  Tag.associate = () => {
    sequelize.Tag.belongsTo(sequelize.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      targetKey: 'id'
    })
    sequelize.Tag.belongsToMany(sequelize.Task, {
      as: 'tasks',
      through: {
        model: sequelize.TaskTag,
        unique: false
      },
      foreignKey: 'tagId',
      constraints: false
    })
  }

  return Tag
}
