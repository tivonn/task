'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize
  const sequelize = app.model

  const Tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  })

  Tag.associate = () => {
    // Tag.belongsToMany(sequelize.Post, {
    //   through: {
    //     model: sequelize.PostTag,
    //     unique: false,
    //   },
    //   foreignKey: 'tagId', //通过外键tagId
    //   constraints: false
    // });
    Tag.belongsToMany(sequelize.Post, {
      through: {
        model: sequelize.TestPostTag,
        unique: false,
      },
      foreignKey: 'tagId', //通过外键tagId
      constraints: false
    });
  }

  // Tag.sync({force: true})

  return Tag
}
