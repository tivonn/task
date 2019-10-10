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
    createUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'createUserId',
      comment: '创建人id'
    }
  }, {
    freezeTableName: true
    // todo auto update time
  })

  TaskType.associate = () => {
    app.model.TaskType.belongsTo(app.model.User, {
      as: 'createUser',
      foreignKey: 'createUserId',
      targetKey: 'id'
    })
  }

  ;(async () => {
    await TaskType.sync({force: true})
    // 默认人员
    // User.create({
    //   name: '卜帅',
    //   imCode: '1230',
    //   account: 'bushuai@henhaoji.com',
    //   password: '123123'
    // })
    // User.create({
    //   name: '黎进',
    //   imCode: '4560',
    //   account: 'lijin@henhaoji.com',
    //   password: '456456'
    // })
    // User.create({
    //   name: '邓锐涛',
    //   imCode: '7890',
    //   account: 'dengruitao@henhaoji.com',
    //   password: '789789'
    // })
  })()

  return TaskType
}
