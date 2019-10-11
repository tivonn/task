'use strict'

const Service = require('egg').Service

class TaskTypeService extends Service {
  get taskTypeModel () {
    return this.app.model.TaskType
  }

  async create(params) {
    const ctx = this.ctx
    const taskType = await ctx.model.TaskType.create(params)
    return taskType
  }
}

module.exports = TaskTypeService
