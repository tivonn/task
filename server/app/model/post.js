'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const Post = sequelize.define('post', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  })

  Post.associate = () => {
    // sequelize.Post.belongsToMany(sequelize.Tag, {
    //   through: {
    //     model: sequelize.PostTag,
    //     unique: false,
    //   },
    //   foreignKey: 'postId', //通过外键postId
    //   constraints: false
    // });
    sequelize.Post.belongsToMany(sequelize.Tag, {
      through: {
        model: sequelize.TestPostTag,
        unique: false,
      },
      foreignKey: 'postId', //通过外键postId
      constraints: false
    });
  }

  // Post.sync({force: true})

  return Post
}
