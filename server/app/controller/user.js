'use strict'

const Controller = require('egg').Controller

const getAllRules = {
  key: {
    type: 'string',
    required: false
  },
  size: {
    type: 'number',
    required: false
  }
}

const getRules = {
  id: {
    type: 'number',
    required: false,
  }
}

class UserController extends Controller {
  get userService () {
    return this.ctx.service.user
  }

  async index () {
    const { ctx } = this
    const params = ctx.filterParams(getAllRules, Object.assign({}, ctx.query))
    const users = await this.userService.index(params)
    ctx.body = users
  }

  async show () {
    const { ctx } = this
    const params = ctx.filterParams(getRules, Object.assign({}, ctx.params))
    const user = await this.userService.show(params)
    ctx.body = user
  }
}

module.exports = UserController
