'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const User = sequelize.define('user', {
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
    imCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'im_code',
      comment: 'im号'
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'account',
      comment: '账号'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password',
      comment: '密码'
    }
  })

  User.associate = () => {
    sequelize.User.belongsToMany(sequelize.Task, {
      as: 'principalTask',
      through: {
        model: app.model.TaskPrincipal,
        unique: false,
      },
      foreignKey: 'principalId',
      constraints: false
    })
    sequelize.User.belongsToMany(sequelize.Task, {
      as: 'ccerTask',
      through: {
        model: app.model.TaskCcer,
        unique: false,
      },
      foreignKey: 'ccerId',
      constraints: false
    })
    sequelize.User.belongsToMany(sequelize.Plan, {
      as: 'principalPlan',
      through: {
        model: app.model.PlanPrincipal,
        unique: false,
      },
      foreignKey: 'principalId',
      constraints: false
    })
    sequelize.User.belongsToMany(sequelize.Branch, {
      as: 'principalBranch',
      through: {
        model: app.model.BranchPrincipal,
        unique: false,
      },
      foreignKey: 'principalId',
      constraints: false
    })
  }

  ;(async () => {
    // 默认人员
    // await User.create({
    //   name: '卜帅',
    //   imCode: '1230',
    //   account: 'bushuai@henhaoji.com',
    //   password: '123123'
    // })
    // await User.create({
    //   name: '黎进',
    //   imCode: '4560',
    //   account: 'lijin@henhaoji.com',
    //   password: '456456'
    // })
    // await User.create({
    //   name: '邓锐涛',
    //   imCode: '7890',
    //   account: 'dengruitao@henhaoji.com',
    //   password: '789789'
    // })
  })()

  return User
}
