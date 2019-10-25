'use strict'

const Service = require('egg').Service

class UserService extends Service {
  get userModel () {
    return this.app.model.User
  }

  async index () {
    const users = await this.userModel.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    return users
  }

  async show (params) {
    const { id } = params
    const user = await this.userModel.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['password']
      }
    })
    return user
  }
}

module.exports = UserService
