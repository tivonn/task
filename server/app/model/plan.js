'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const Plan = sequelize.define('plan', {
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
      comment: '计划名'
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
      comment: '任务id'
    },
    isFinished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_finished',
      comment: '是否已完成'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_time',
      comment: '开始时间'
    },
    finishedTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'finished_time',
      comment: '完成时间'
    },
    reminderTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reminder_time',
      comment: '提醒时间'
    }
  })

  Plan.associate = () => {
    sequelize.Plan.hasMany(sequelize.PlanPrincipal, {
      as: 'principal',
      sourceKey: 'id',
      targetKey: 'planId'
    })
    sequelize.Plan.belongsToMany(sequelize.User, {
      as: 'principals',
      through: {
        model: app.model.PlanPrincipal,
        unique: false
      },
      foreignKey: 'planId',
      constraints: false
    })
  }

  return Plan
}
