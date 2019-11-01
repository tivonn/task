'use strict'

const Service = require('egg').Service

const { TASK_STATUS } = require('../enum/task')

class TaskService extends Service {
  get taskModel () {
    return this.app.model.Task
  }

  async index (params) {
    const { ctx, app } = this
    const { Op } = app.Sequelize
    const { status } = params
    let taskWhere = {
      creatorId: ctx.state.currentUser.id
    }
    if (status) {
      taskWhere.status = Object.keys(TASK_STATUS).find(key => TASK_STATUS[key].value === status)
    }
    const tasks = await this.app.model.TaskType.findAll({
      where: {
        [Op.or]: [
          {
            isDefault: true
          },
          {
            creatorId: ctx.state.currentUser.id
          }
        ]
      },
      attributes: ['id', 'name', 'color', 'isDefault'],
      include: {
        model: this.taskModel,
        as: 'task',
        taskWhere,
        attributes: ['id', 'name', 'status', 'deadline'],
        include: {
          model: this.app.model.Tag,
          as: 'tags',
          // todo how to delete associate column
          attributes: ['id', 'name']
        }
      }
    })
    return tasks
  }

  async show (params) {
    const { ctx } = this
    const { id } = params
    const task = await this.taskModel.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: {
        model: this.app.model.Tag,
        as: 'tags',
        attributes: ['id', 'name']
      }
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
    const { taskTypeId } = params
    const taskType = await this.app.model.TaskType.findOne({
      where: {
        id: taskTypeId
      }
    })
    if (!taskType) {
      ctx.throw(404, '不存在该任务类型')
    }
    if (taskType.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(404, '无权限创建该任务类型的任务')
    }
    // todo optimize default
    const updateDefault = {
      status: TASK_STATUS['unfinished'].value,
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
