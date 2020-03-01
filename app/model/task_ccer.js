'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const TaskCcer = sequelize.define('task_ccer', {
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
      unique: 'taskCcer',
      field: 'task_id',
      comment: '任务id'
    },
    ccerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'taskCcer',
      field: 'ccer_id',
      comment: '抄送人id'
    }
  })

  return TaskCcer
}
