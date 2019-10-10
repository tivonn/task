'use strict'

const Service = require('egg').Service

class UserService extends Service {
  get userModel () {
    return this.app.model.User
  }

  async index (params) {
    return await this.userModel.findAll({
      attributes: params.attributes
    })
  }

  async show (params) {
    return await this.userModel.findOne({
      where: {
        id: params.id
      },
      attributes: params.attributes
    })
  }
}

module.exports = UserService
