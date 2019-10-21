'use strict'

const Controller = require('egg').Controller

const getRules = {
  attributes: {
    exclude: ['password']
  }
}

class UserController extends Controller {
  get userService () {
    return this.ctx.service.user
  }

  async index () {
    const { ctx } = this
    const params = Object.assign({}, getRules)
    const users = await this.userService.index(params)
    ctx.body = users
  }

  async show () {
    const { ctx } = this
    const params = Object.assign({}, getRules, ctx.params)
    const user = await this.userService.show(params)
    ctx.body = user
  }
}

module.exports = UserController
