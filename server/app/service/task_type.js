'use strict'

const Service = require('egg').Service

class TaskTypeService extends Service {
  get taskTypeModel () {
    return this.app.model.TaskType
  }

  async create (params) {
    const taskType = await this.taskTypeModel.create(params)
    return taskType
  }

  async destroy (params) {
    const ctx = this.ctx
    const { id, createUserId } = params
    const taskType = await this.taskTypeModel.findOne({
      where: {
        id,
        createUserId
      }
    })
    if (!taskType) {
      ctx.throw(404)
      return
    }
    if (taskType.isDefault) {
      ctx.status = 422
      return
    }
    await taskType.destroy()
    ctx.status = 200
  }
}

module.exports = TaskTypeService
