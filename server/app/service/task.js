'use strict'

const Service = require('egg').Service

class TaskService extends Service {
  get taskModel () {
    return this.app.model.Task
  }

  async index (params) {
    return []
  }

  async show (params) {
    const { ctx } = this
    const { id, attributes } = params
    const task = await this.taskModel.findOne({
      where: {
        id
      },
      attributes
    })
    if (!task) {
      ctx.throw(404, '不存在该任务')
    }
    if (task.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限查看')
    }
    return task
  }

  async create (params) {
    const { ctx } = this
    const updateDefault = {
      isCompleted: false,
      creatorId: ctx.state.currentUser.id
    }
    const task = await this.taskModel.create(Object.assign(params, updateDefault))
    return task
  }

  async update (params) {
    const { ctx } = this
    const { id } = params
    const task = await this.taskModel.findOne({
      where: {
        id
      }
    })
    if (!task) {
      ctx.throw(404, '不存在该任务')
    }
    if (task.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(422, '无权限更新')
    }
    // todo validate
    delete params.id
    await task.update(params)
    return task
  }

  async destroy (params) {
    const { ctx } = this
    const { id } = params
    const task = await this.taskModel.findOne({
      where: {
        id
      }
    })
    if (!task) {
      ctx.throw(404, '不存在该任务')
    }
    if (task.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(422, '无权限删除')
    }
    await task.destroy()
    ctx.status = 200
  }
}

module.exports = TaskService
