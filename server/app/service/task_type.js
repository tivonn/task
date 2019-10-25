'use strict'

const Service = require('egg').Service

class TaskTypeService extends Service {
  get taskTypeModel () {
    return this.app.model.TaskType
  }

  async index () {
    const { ctx, app } = this
    const { Op } = app.Sequelize
    const taskTypes = await this.taskTypeModel.findAll({
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
      attributes: ['id', 'name', 'color']
    })
    return taskTypes
  }

  async create (params) {
    const { ctx } = this
    const updateDefault = {
      isDefault: false,
      creatorId: ctx.state.currentUser.id
    }
    const taskType = await this.taskTypeModel.create(Object.assign({}, params, updateDefault))
    return taskType
  }

  async destroy (params) {
    const { ctx } = this
    const { id } = params
    const taskType = await this.taskTypeModel.findOne({
      where: {
        id
      }
    })
    if (!taskType) {
      ctx.throw(404, '不存在该任务类型')
    }
    if (taskType.isDefault) {
      ctx.throw(422, '默认任务类型无法删除')
    }
    if (taskType.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(422, '无权限删除')
    }
    await taskType.destroy()
    ctx.status = 200
  }
}

module.exports = TaskTypeService
