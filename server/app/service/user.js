'use strict'

const Service = require('egg').Service

class UserService extends Service {
  get userModel () {
    return this.app.model.User
  }

  async index (params) {
    const users = await this.userModel.findAll({
      attributes: params.attributes
    })
    return users
  }

  async show (params) {
    const user = await this.userModel.findOne({
      where: {
        id: params.id
      },
      attributes: params.attributes
    })
    return user
  }
}

module.exports = UserService
