'use strict'

const Controller = require('egg').Controller

const createRules = {
  name: {
    type: 'string',
    required: true
  }
}

const updateRules = {
  id: {
    type: 'number',
    required: true,
  },
  name: {
    type: 'string',
    required: true
  }
}

class TagController extends Controller {
  get tagService () {
    return this.ctx.service.tag
  }

  async index () {
    const { ctx } = this
    const tags = await this.tagService.index()
    ctx.body = tags
  }

  async create () {
    const { ctx } = this
    const params = ctx.filterParams(createRules, Object.assign({}, ctx.request.body))
    const tag = await this.tagService.create(params)
    ctx.body = tag
  }

  async update () {
    const { ctx } = this
    const params = ctx.filterParams(updateRules, Object.assign({}, ctx.params, ctx.request.body))
    const tag = await this.tagService.update(params)
    ctx.body = tag
  }

  async destroy () {
    const { ctx } = this
    const params = Object.assign({}, ctx.params)
    await this.tagService.destroy(params)
  }
}

module.exports = TagController
