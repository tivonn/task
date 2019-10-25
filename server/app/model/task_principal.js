'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const TaskPrincipal = sequelize.define('taskPrincipal', {
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
      unique: 'taskPrincipal',
      field: 'task_id',
      comment: '任务id'
    },
    principalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'taskPrincipal',
      field: 'principal_id',
      comment: '负责人id'
    }
  })

  return TaskPrincipal
}
