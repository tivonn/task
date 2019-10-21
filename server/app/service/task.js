'use strict'

const Service = require('egg').Service

class TaskService extends Service {
  get taskModel () {
    return this.app.model.Task
  }

  async index (params) {
    const { ctx } = this
    const { attributes } = params
    const tasks = await this.app.model.TaskType.findAll({
      attributes: ['id', 'name', 'color', 'isDefault'],
      include: {
        model: this.taskModel,
        as: 'task',
        where: {
          creatorId: ctx.state.currentUser.id
        },
        attributes: ['id', 'name', 'isCompleted', 'deadline']
      }
    })
    return tasks
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
    const task = await this.taskModel.create(Object.assign({}, params, updateDefault))
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
