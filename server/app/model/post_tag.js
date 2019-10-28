'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const PostTag = sequelize.define('post_tag', {
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

  return PostTag
}
