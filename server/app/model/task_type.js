'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize

  const TaskType = app.model.define('task_type', {
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
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      comment: '创建时间'
    },
    updatedAt: {
      // todo auto update time
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      comment: '更新时间'
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  TaskType.associate = () => {
    app.model.TaskType.belongsTo(app.model.User, {
      as: 'createUser',
      foreignKey: 'createUserId',
      targetKey: 'id'
    })
  }

  ;(async () => {
    // await TaskType.sync()
    // 默认任务类型
    // TaskType.create({
    //   name: '今日待办',
    //   color: '#e6a23c',
    //   isDefault: true
    // })
    // TaskType.create({
    //   name: '近期待办',
    //   color: '#409eff',
    //   isDefault: true
    // })
    // TaskType.create({
    //   name: '后续待办',
    //   color: '#55c580',
    //   isDefault: true
    // })
  })()

  return TaskType
}
