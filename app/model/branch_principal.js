'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const BranchPrincipal = sequelize.define('branch_principal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
      comment: 'id'
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'branchPrincipal',
      field: 'branch_id',
      comment: '分支id'
    },
    principalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'branchPrincipal',
      field: 'principal_id',
      comment: '负责人id'
    }
  })

  return BranchPrincipal
}
