'use strict'

const Service = require('egg').Service

class UserService extends Service {
  get userModel () {
    return this.app.model.User
  }

  async index (params) {
    const { attributes } = params
    const users = await this.userModel.findAll({
      attributes
    })
    return users
  }

  async show (params) {
    const { id, attributes } = params
    const user = await this.userModel.findOne({
      where: {
        id
      },
      attributes
    })
    return user
  }
}

module.exports = UserService
