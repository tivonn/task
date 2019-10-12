'use strict'

const Controller = require('egg').Controller

const updateDefault = {
  isDefault: false
}

class TaskTypeController extends Controller {
  get taskTypeService () {
    return this.ctx.service.taskType
  }

  async create () {
    const ctx = this.ctx
    const params = Object.assign({}, ctx.request.body, updateDefault)
    // todo validate
    const taskType = await this.taskTypeService.create(params)
    ctx.body = taskType
  }

  async destroy () {
    const ctx = this.ctx
    const params = Object.assign({}, ctx.params)
    await this.taskTypeService.destroy(params)
  }
}

module.exports = TaskTypeController