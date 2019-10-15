'use strict'

const Controller = require('egg').Controller

const getRule = {
  attributes: ['id', 'name', 'color']
}


class TaskTypeController extends Controller {
  get taskTypeService () {
    return this.ctx.service.taskType
  }

  async index () {
    const { ctx } = this
    const params = Object.assign({}, getRule)
    const taskTypes = await this.taskTypeService.index(params)
    ctx.body = taskTypes
  }

  async create () {
    const { ctx } = this
    const params = Object.assign({}, ctx.request.body)
    // todo validate
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
