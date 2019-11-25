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
    const attributes = ['id', 'name', 'status', 'deadline']
    const include = {
      model: app.model.Tag,
      as: 'tags',
      // todo how to delete associate column
      attributes: ['id', 'name']
    }
    const createTasks = await app.model.TaskType.findAll({
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
        as: 'tasks',
        where: taskWhere,
        attributes,
        include
      }
    })
    const principalTasks = await this.taskFactory({
      name: '我负责的',
      color: '#55c580',
      tasks: await this.taskModel.findAll({
        where: app.Sequelize.literal(`exists(select 1 from task_principal where principal_id = ${ctx.state.currentUser.id} and task_id = task.id)`),
        attributes,
        include
      })
    })
    const ccTasks = await this.taskFactory({
      name: '抄送我的',
      color: '#409eff',
      tasks:  await this.taskModel.findAll({
        where: app.Sequelize.literal(`exists(select 1 from task_ccer where ccer_id = ${ctx.state.currentUser.id} and task_id = task.id)`),
        attributes,
        include
      })
    })
    const tasks = [...createTasks, principalTasks, ccTasks]
    return tasks
  }

  async taskFactory (options = {
    name: '',
    color: '',
    tasks: []
  }) {
    const { name, color, tasks } = options
    return {
      id: null,
      name,
      color,
      isDefault: true,
      tasks
    }
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
        attributes: {
          exclude: ['creatorId', 'createdAt', 'updatedAt']
        }
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
      }, {
        model: app.model.TaskRate,
        as: 'taskRates',
        attributes: {
          exclude: ['taskId', 'createdAt', 'updatedAt']
        },
        include: {
          model: app.model.User,
          as: 'rater',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }
      }, {
        model: app.model.MemberRate,
        as: 'memberRates',
        attributes: {
          exclude: ['taskId', 'createdAt', 'updatedAt']
        },
        include: [{
          model: app.model.User,
          as: 'member',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }, {
          model: app.model.User,
          as: 'rater',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }]
      }]
    })
    if (!task) {
      ctx.throw(404, '不存在该任务')
    }
    const isCreator = task.creatorId === ctx.state.currentUser.id
    const isPrincipal = await app.model.TaskPrincipal.findOne({
      where: {
        taskId: id,
        principalId: ctx.state.currentUser.id
      }
    })
    const isCcer = await app.model.TaskCcer.findOne({
      where: {
        taskId: id,
        ccerId: ctx.state.currentUser.id
      }
    })
    if (!isCreator && !isPrincipal && !isCcer) {
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
    const isCreator = task.creatorId === ctx.state.currentUser.id
    const isPrincipal = await app.model.TaskPrincipal.findOne({
      where: {
        taskId: id,
        principalId: ctx.state.currentUser.id
      }
    })
    // 抄送人无权限更新
    if (!isCreator && !isPrincipal) {
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
    if (params.hasOwnProperty('status')) {
      switch (params['status']) {
        case TASK_STATUS['unfinished'].value:
          params['finishedTime'] = null
          break
        case TASK_STATUS['finished'].value:
          params['finishedTime'] = new Date()
          break
        default:
          break
      }
    }
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

  async taskRate (params) {
    const { ctx, app } = this
    const { taskId } = params
    const task = await this.show({ id: taskId })
    if (task.status !== TASK_STATUS['finished'].value) {
      ctx.throw(422, '仅在完成状态下允许对该任务作出评价')
    }
    const taskRate = await app.model.TaskRate.findOne({
      where: {
        taskId,
        raterId: ctx.state.currentUser.id
      }
    })
    if (taskRate) {
      ctx.throw(422, '已对该任务作出评价')
    }
    const updateDefault = {
      raterId: ctx.state.currentUser.id
    }
    await app.model.TaskRate.create(Object.assign({}, params, updateDefault))
    ctx.status = 200
  }

  async memberRate (params) {
    const { ctx, app } = this
    const { taskId, memberId } = params
    const task = await this.show({ id: taskId })
    if (task.status !== TASK_STATUS['finished'].value) {
      ctx.throw(422, '仅在完成状态下允许对该任务作出评价')
    }
    if (params.memberId === ctx.state.currentUser.id) {
      ctx.throw(422, '不允许评价自己')
    }
    const memberRate = await app.model.MemberRate.findOne({
      where: {
        taskId,
        memberId,
        raterId: ctx.state.currentUser.id
      }
    })
    if (memberRate) {
      ctx.throw(422, '已对该成员作出评价')
    }
    const updateDefault = {
      raterId: ctx.state.currentUser.id
    }
    await app.model.MemberRate.create(Object.assign({}, params, updateDefault))
    ctx.status = 200
  }

  async getMembers (params) {
    const { ctx } = this
    const { id } = params
    const task = await this.show({ id })
    const members = ctx.helper.uniqueArray([task.creator, ...task.principals, ...task.ccers], 'id')
    return members
  }
}

module.exports = TaskService
