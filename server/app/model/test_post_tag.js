'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const TestPostTag = sequelize.define('test_post_tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      // unique: 'postTag'
    },
    tagId:{
      type: DataTypes.INTEGER,
      // unique: 'postTag',
      allowNull:false,
      // references: null
    },
  })

  // PostTag.sync({force:true})

  return TestPostTag
}
