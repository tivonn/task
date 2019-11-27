'use strict'

const Service = require('egg').Service

class UserService extends Service {
  get userModel () {
    return this.app.model.User
  }

  async index (params) {
    const { app } = this
    const { Op } = app.Sequelize
    const { key, size = 20 } = params
    const where = key
      ?
      {
        name:
          {
            [Op.like]: `%${key}%`
          }
      }
      : {}
    const users = await this.userModel.findAll({
      where,
      limit: size,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    })
    return users
  }

  async get (params) {
    const { id } = params
    const user = await this.userModel.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    })
    return user
  }
}

module.exports = UserService
