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
      unique: 'taskTag',
      field: 'task_id',
      comment: '任务id'
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'taskTag',
      field: 'tag_id',
      comment: '标签id'
    }
  })

  return TaskTag
}
