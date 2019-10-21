'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const Task = sequelize.define('task', {
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
      comment: '姓名'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description',
      comment: '描述'
    },
    // todo change to enum
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'isCompleted',
      comment: '是否已完成'
    },
    deadline: {
      type: DataTypes.DATE,
      field: 'deadline',
      comment: '截止时间'
    },
    taskTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_type_id',
      comment: '任务类型id'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'creator_id',
      comment: '创建人id'
    },
    principalId: {
      type: DataTypes.INTEGER,
      field: 'principal_id',
      comment: '负责人id'
    },
    ccerId: {
      type: DataTypes.INTEGER,
      field: 'ccer_id',
      comment: '抄送人id'
    }
  })

  Task.associate = () => {
    sequelize.Task.belongsTo(sequelize.TaskType, {
      as: 'taskType',
      foreignKey: 'taskTypeId',
      targetKey: 'id'
    })
    sequelize.Task.belongsTo(sequelize.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      targetKey: 'id'
    })
    sequelize.Task.belongsTo(sequelize.User, {
      as: 'principal',
      foreignKey: 'principalId',
      targetKey: 'id'
    })
    sequelize.Task.belongsTo(sequelize.User, {
      as: 'ccer',
      foreignKey: 'ccerId',
      targetKey: 'id'
    })
  }

  return Task
}
