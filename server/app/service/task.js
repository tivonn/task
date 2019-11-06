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
      taskWhere.status = status
    }
    const tasks = await app.model.TaskType.findAll({
      where: {
        [Op.or]: [{
          isDefault: true
        }, {
          creatorId: ctx.state.currentUser.id
        }]
      },
      attributes: ['id', 'name', 'color', 'isDefault'],
      include: {
        model: this.taskModel,
        as: 'task',
        where: taskWhere,
        attributes: ['id', 'name', 'status', 'deadline'],
        include: {
          model: app.model.Tag,
          as: 'tags',
          // todo how to delete associate column
          attributes: ['id', 'name']
        }
      }
    })
    return tasks
  }

  async show (params) {
    const { ctx, app } = this
    const { id } = params
    const task = await this.taskModel.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [{
        model: app.model.User,
        as: 'creator',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }, {
        model: app.model.Tag,
        as: 'tags',
        attributes: ['id', 'name']
      }, {
        model: app.model.User,
        as: 'principals',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }, {
        model: app.model.User,
        as: 'ccers',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }]
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
    const { ctx, app } = this
    const { taskTypeId } = params
    const taskType = await app.model.TaskType.findOne({
      where: {
        id: taskTypeId
      }
    })
    if (!taskType) {
      ctx.throw(404, '不存在该任务类型')
    }
    if (!taskType.isDefault && taskType.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限创建')
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
    const { ctx, app } = this
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
      ctx.throw(403, '无权限更新')
    }
    // 更新关联表
    if (params.hasOwnProperty('principalIds')) {
      const { principalIds } = params
      await task.setPrincipals(principalIds)
    } else if (params.hasOwnProperty('ccerIds')) {
      const { ccerIds } = params
      await task.setCcers(ccerIds)
    } else if (params.hasOwnProperty('tagIds')) {
      const { tagIds } = params
      const tags = await app.model.Tag.findAll({
        where: {
          id: tagIds,
          creatorId: ctx.state.currentUser.id
        }
      })
      await task.setTags(tags)
    }
    // 更新主表
    await task.update(params)
    return await this.show({ id })
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
      ctx.throw(403, '无权限删除')
    }
    await task.destroy()
    ctx.status = 200
  }

  async getMembers (params) {
    const { ctx, app } = this
    const { id } = params
    const task = await this.show({ id })
    const members = ctx.helper.uniqueArray([task.creator].concat(task.principals).concat(task.ccers), 'id')
    return members
  }
}

module.exports = TaskService
