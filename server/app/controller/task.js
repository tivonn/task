'use strict'

const Controller = require('egg').Controller

const getRule = {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
  }
}

class TaskController extends Controller {
  get taskService () {
    return this.ctx.service.task
  }

  async index () {
    const { ctx } = this
    const params = Object.assign({}, getRule)
    const tasks = await this.taskService.index(params)
    ctx.body = tasks
  }

  async show () {
    const { ctx } = this
    const params = Object.assign({}, getRule, ctx.params)
    const task = await this.taskService.show(params)
    ctx.body = task
  }

  async create () {
    const { ctx } = this
    const params = Object.assign({}, ctx.request.body)
    const task = await this.taskService.create(params)
    ctx.body = task
  }

  async update () {
    const ctx = this.ctx
    const params = Object.assign({}, ctx.params, ctx.request.body)
    const task = await this.taskService.update(params)
    ctx.body = task
  }

  async destroy () {
    const { ctx } = this
    const params = Object.assign({}, ctx.params)
    await this.taskService.destroy(params)
  }
}

module.exports = TaskController
