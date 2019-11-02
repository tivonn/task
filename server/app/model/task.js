'use strict'

const { TASK_STATUS } = require('../enum/task')

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
      allowNull: true,
      field: 'description',
      comment: '描述'
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.keys(TASK_STATUS),
      allowNull: false,
      get () {
        return TASK_STATUS[this.getDataValue('status')].value
      },
      set (value) {
        this.setDataValue('status', Object.keys(TASK_STATUS).find(key => TASK_STATUS[key].value === value))
      },
      field: 'status',
      comment: '状态'
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
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
    sequelize.Task.belongsToMany(sequelize.Tag, {
      as: 'tags',
      through: {
        model: sequelize.TaskTag,
        unique: false
      },
      foreignKey: 'taskId',
      constraints: false
    })
    sequelize.Task.belongsToMany(sequelize.User, {
      as: 'principals',
      through: {
        model: app.model.TaskPrincipal,
        unique: false,
      },
      foreignKey: 'taskId',
      constraints: false
    })
    sequelize.Task.belongsToMany(sequelize.User, {
      as: 'ccers',
      through: {
        model: app.model.TaskCcer,
        unique: false,
      },
      foreignKey: 'taskId',
      constraints: false
    })
  }

  return Task
}
