'use strict'

const Controller = require('egg').Controller

class TaskTypeController extends Controller {
  get taskTypeService () {
    return this.ctx.service.taskType
  }

  async create() {
    const ctx = this.ctx;
    const params = Object.assign({}, ctx.request.body)
    // todo validate
    const taskType = await this.taskTypeService.create(params)
    ctx.body = taskType
  }
}

module.exports = TaskTypeController
