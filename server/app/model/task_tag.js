'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const TaskTag = sequelize.define('task_tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'taskTag'
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'taskTag'
    }
  })

  return TaskTag
}
