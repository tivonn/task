'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const MemberRate = sequelize.define('member_rate', {
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
      comment: '工作质量'
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'speed',
      comment: '工作速度'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comment',
      comment: '评语'
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'member_id',
      comment: '成员id'
    },
    raterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'creator_id',
      comment: '评价人id'
    }
  })

  MemberRate.associate = () => {
    sequelize.MemberRate.belongsTo(sequelize.User, {
      as: 'member',
      foreignKey: 'memberId',
      targetKey: 'id'
    })
    sequelize.MemberRate.belongsTo(sequelize.User, {
      as: 'rater',
      foreignKey: 'raterId',
      targetKey: 'id'
    })
  }

  return MemberRate
}
