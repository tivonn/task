'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const PlanPrincipal = sequelize.define('plan_principal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'planPrincipal',
      field: 'plan_id',
      comment: '计划id'
    },
    principalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'planPrincipal',
      field: 'principal_id',
      comment: '负责人id'
    }
  })

  return PlanPrincipal
}
