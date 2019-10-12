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
    createUserId: {
      type: DataTypes.INTEGER,
      field: 'create_user_id',
      comment: '创建人id'
    }
  }, {
    freezeTableName: true
  })

  TaskType.associate = () => {
    sequelize.TaskType.belongsTo(sequelize.User, {
      as: 'createUser',
      foreignKey: 'createUserId',
      targetKey: 'id'
    })
  }

  ;(async () => {
    // await TaskType.sync()
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
