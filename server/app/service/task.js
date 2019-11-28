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
    const { status, isCreate, isPrincipal, isCC } = params
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
        where: {
          [Op.and]: [
            taskWhere,
            app.Sequelize.literal(`exists(select 1 from task_principal where principal_id = ${ctx.state.currentUser.id} and task_id = task.id)`)
          ]
        },
        attributes,
        include
      })
    })
    const ccTasks = await this.taskFactory({
      name: '抄送我的',
      color: '#409eff',
      tasks:  await this.taskModel.findAll({
        where: {
          [Op.and]: [
            taskWhere,
            app.Sequelize.literal(`exists(select 1 from task_ccer where ccer_id = ${ctx.state.currentUser.id} and task_id = task.id)`)
            ]
        },
        attributes,
        include
      })
    })
    const isAll = !!isCreate && !!isPrincipal && !!isCC || !isCreate && !isPrincipal && !isCC
    const typeMap = {
      'create': isCreate,
      'principal': isPrincipal,
      'cc': isCC
    }
    const types = ['create', 'principal', 'cc'].filter(type => isAll || typeMap[type])
    const tasks = types.reduce((p, v) => {
      switch (v) {
        case 'create':
          p.push(...createTasks)
          break
        case 'principal':
          p.push(principalTasks)
          break
        case 'cc':
          p.push(ccTasks)
          break
      }
      return p
    }, [])
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

  async get (params) {
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
      }, {
        model: app.model.Plan,
        as: 'plans',
        attributes: {
          exclude: ['taskId', 'createdAt', 'updatedAt']
        },
        include: [{
          model: app.model.User,
          as: 'principals',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }, {
          model: app.model.Branch,
          as: 'branchs',
          attributes: {
            exclude: ['taskId', 'planId', 'createdAt', 'updatedAt']
          },
          include: {
            model: app.model.User,
            as: 'principals',
            attributes: {
              exclude: ['password', 'createdAt', 'updatedAt']
            }
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
    return await this.get({ id })
  }

  async delete (params) {
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

  async createTaskRate (params) {
    const { ctx, app } = this
    const { taskId } = params
    const task = await this.get({ id: taskId })
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

  async createMemberRate (params) {
    const { ctx, app } = this
    const { taskId, memberId } = params
    const task = await this.get({ id: taskId })
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
    const task = await this.get({ id })
    const members = ctx.helper.uniqueArray([task.creator, ...task.principals, ...task.ccers], 'id')
    return members
  }

  async createPlan (params) {
    const { ctx, app } = this
    const { taskId } = params
    const task = await this.get({ id: taskId })
    const updateDefault = {
      isFinished: false
    }
    await app.model.Plan.create(Object.assign({}, params, updateDefault))
    ctx.status = 200
  }

  async updatePlan (params) {
    const { ctx, app } = this
    const { id, taskId } = params
    const task = await this.get({ id: taskId })
    const plan = await app.model.Plan.findOne({
      where: {
        id,
        taskId
      }
    })
    if (!plan) {
      ctx.throw(404, '不存在该计划')
    }
    // 更新关联表
    if (params.hasOwnProperty('principalIds')) {
      const { principalIds } = params
      const members = await this.getMembers({ id: taskId })
      let planPrincipalIds = principalIds.filter(id => members.some(member => member.id === id))
      await plan.setPrincipals(planPrincipalIds)
    }
    // 更新主表
    if (params.hasOwnProperty('startTime') && !params.hasOwnProperty('finishedTime')
    || !params.hasOwnProperty('startTime') && params.hasOwnProperty('finishedTime')) {
      ctx.throw(422, '起止时间需同时更新')
    }
    await plan.update(params)
    ctx.status = 200
  }

  async deletePlan (params) {
    const { ctx, app } = this
    const { id, taskId } = params
    const task = await this.taskModel.findOne({
      where: {
        id: taskId
      }
    })
    if (!task) {
      ctx.throw(404, '不存在该任务')
    }
    if (task.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限删除')
    }
    const plan = await app.model.Plan.findOne({
      where: {
        id,
        taskId
      }
    })
    if (!plan) {
      ctx.throw(404, '不存在该计划')
    }
    await plan.destroy()
    ctx.status = 200
  }

  async createBranch (params) {
    const { ctx, app } = this
    const { taskId } = params
    const task = await this.get({ id: taskId })
    const updateDefault = {
      isFinished: false
    }
    await app.model.Branch.create(Object.assign({}, params, updateDefault))
    ctx.status = 200
  }

  async updateBranch (params) {
    const { ctx, app } = this
    const { id, taskId, planId } = params
    const task = await this.get({ id: taskId })
    const branch = await app.model.Branch.findOne({
      where: {
        id,
        taskId,
        planId
      }
    })
    if (!branch) {
      ctx.throw(404, '不存在该分支')
    }
    // 更新关联表
    if (params.hasOwnProperty('principalIds')) {
      const { principalIds } = params
      const members = await this.getMembers({ id: taskId })
      let branchPrincipalIds = principalIds.filter(id => members.some(member => member.id === id))
      await branch.setPrincipals(branchPrincipalIds)
    }
    // 更新主表
    if (params.hasOwnProperty('startTime') && !params.hasOwnProperty('finishedTime')
      || !params.hasOwnProperty('startTime') && params.hasOwnProperty('finishedTime')) {
      ctx.throw(422, '起止时间需同时更新')
    }
    await branch.update(params)
    ctx.status = 200
  }

  async deleteBranch (params) {
    const { ctx, app } = this
    const { id, taskId, planId } = params
    const task = await this.taskModel.findOne({
      where: {
        id: taskId
      }
    })
    if (!task) {
      ctx.throw(404, '不存在该任务')
    }
    if (task.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限删除')
    }
    const branch = await app.model.Branch.findOne({
      where: {
        id,
        taskId,
        planId
      }
    })
    if (!branch) {
      ctx.throw(404, '不存在该分支')
    }
    await branch.destroy()
    ctx.status = 200
  }
}

module.exports = TaskService
