'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const TaskRate = sequelize.define('task_rate', {
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
      field: 'task_id',
      comment: '任务id'
    },
    quality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quality',
      comment: '完成质量'
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'speed',
      comment: '完成速度'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comment',
      comment: '评语'
    },
    raterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'creator_id',
      comment: '评价人id'
    }
  })

  TaskRate.associate = () => {
    sequelize.TaskRate.belongsTo(sequelize.Task, {
      as: 'task',
      foreignKey: 'taskId',
      targetKey: 'id'
    })
    sequelize.TaskRate.belongsTo(sequelize.User, {
      as: 'rater',
      foreignKey: 'raterId',
      targetKey: 'id'
    })
  }

  return TaskRate
}
