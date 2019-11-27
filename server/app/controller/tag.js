'use strict'

const Controller = require('egg').Controller

const getAllRules = {
  key: {
    type: 'string',
    required: false
  }
}

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

const deleteRules = {
  id: {
    type: 'number',
    required: true
  }
}

class TagController extends Controller {
  get tagService () {
    return this.ctx.service.tag
  }

  async index () {
    const { ctx } = this
    const params = ctx.filterParams(getAllRules, Object.assign({}, ctx.query))
    const tags = await this.tagService.index(params)
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

  async delete () {
    const { ctx } = this
    const params = ctx.filterParams(deleteRules, Object.assign({}, ctx.params))
    await this.tagService.delete(params)
  }
}

module.exports = TagController
