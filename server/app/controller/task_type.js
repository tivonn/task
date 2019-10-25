'use strict'

const Controller = require('egg').Controller

const createRules = {
  name: {
    type: 'string',
    required: true
  },
  color: {
    type: 'string',
    required: true
  }
}

class TaskTypeController extends Controller {
  get taskTypeService () {
    return this.ctx.service.taskType
  }

  async index () {
    const { ctx } = this
    const taskTypes = await this.taskTypeService.index()
    ctx.body = taskTypes
  }

  async create () {
    const { ctx } = this
    const params = ctx.filterParams(createRules, Object.assign({}, ctx.request.body))
    const taskType = await this.taskTypeService.create(params)
    ctx.body = taskType
  }

  async destroy () {
    const { ctx } = this
    const params = Object.assign({}, ctx.params)
    await this.taskTypeService.destroy(params)
  }
}

module.exports = TaskTypeController
