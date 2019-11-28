'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const Branch = sequelize.define('branch', {
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
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'plan_id',
      comment: '计划id'
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

  Branch.associate = () => {
    sequelize.Branch.hasMany(sequelize.BranchPrincipal, {
      as: 'principal',
      sourceKey: 'id',
      targetKey: 'branchId'
    })
    sequelize.Branch.belongsToMany(sequelize.User, {
      as: 'principals',
      through: {
        model: app.model.BranchPrincipal,
        unique: false
      },
      foreignKey: 'branchId',
      constraints: false
    })
  }

  return Branch
}
