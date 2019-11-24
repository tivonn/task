'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const TaskType = sequelize.define('task_type', {
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
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'color',
      comment: '颜色'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_default',
      comment: '是否初始值'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'creator_id',
      comment: '创建人id'
    }
  })

  TaskType.associate = () => {
    sequelize.TaskType.hasMany(sequelize.Task, {
      as: 'tasks',
      sourceKey: 'id',
      targetKey: 'taskTypeId'
    })
    sequelize.TaskType.belongsTo(sequelize.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      targetKey: 'id'
    })
  }

  ;(async () => {
    // 默认任务类型
    // await TaskType.create({
    //   name: '今日待办',
    //   color: '#e6a23c',
    //   isDefault: true
    // })
    // await TaskType.create({
    //   name: '近期待办',
    //   color: '#409eff',
    //   isDefault: true
    // })
    // await TaskType.create({
    //   name: '后续待办',
    //   color: '#55c580',
    //   isDefault: true
    // })
  })()

  return TaskType
}
