const Controller = require('egg').Controller

const getRule = {
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
    const params = getRule
    ctx.body = await this.userService.index(params)
  }

  async show () {
    const { ctx } = this
    const params = Object.assign({}, getRule, ctx.params)
    ctx.body = await this.userService.show(params)
  }
}

module.exports = UserController
