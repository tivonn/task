'use strict'

const Controller = require('egg').Controller

const { TASK_STATUS, TASK_PRIORITY } = require('../enum/task')

const getAllRules = {
  id: {
    type: 'number',
    required: false,
  },
  status: {
    type: 'number',
    required: false
  },
  isCreate: {
    type: 'boolean',
    required: false
  },
  isPrincipal: {
    type: 'boolean',
    required: false
  },
  isCC: {
    type: 'boolean',
    required: false
  },
}

const getRules = {
  id: {
    type: 'number',
    required: false,
  }
}

const createRules = {
  name: {
    type: 'string',
    required: true
  },
  taskTypeId: {
    type: 'number',
    required: true
  },
  deadline: {
    type: 'dateTime',
    required: false
  }
}

const updateRules = {
  id: {
    type: 'number',
    required: true,
  },
  name: {
    type: 'string',
    required: false,
    allowEmpty: false
  },
  description: {
    type: 'string',
    required: false,
    allowEmpty: true
  },
  status: {
    type: 'intEnum',
    required: false,
    enum: TASK_STATUS
  },
  deadline: {
    type: 'dateTime',
    required: false
  },
  priority: {
    type: 'intEnum',
    required: false,
    enum: TASK_PRIORITY
  },
  reminderTime: {
    type: 'dateTime',
    required: false
  },
  taskTypeId: {
    type: 'number',
    required: false
  },
  principalIds: {
    type: 'array',
    required: false,
    itemType: 'number'
  },
  ccerIds: {
    type: 'array',
    required: false,
    itemType: 'number'
  },
  tagIds: {
    type: 'array',
    required: false,
    itemType: 'number'
  }
}

const deleteRules = {
  id: {
    type: 'number',
    required: true
  }
}

const updateTaskRateRules = {
  taskId: {
    type: 'number',
    required: true,
  },
  quality: {
    type: 'int',
    required: true,
    max: 5,
    min: 1
  },
  speed: {
    type: 'int',
    required: true,
    max: 5,
    min: 1
  },
  comment: {
    type: 'string',
    required: true,
    allowEmpty: true
  },
}

const updateMemberRateRules = Object.assign({}, updateTaskRateRules, {
  memberId: {
    type: 'number',
    required: true
  }
})

const getMemberRules = getRules

const createPlanRules = {
  taskId: {
    type: 'number',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  }
}

const updatePlanRules = {
  id: {
    type: 'number',
    required: true,
  },
  taskId: {
    type: 'number',
    required: true,
  },
  name: {
    type: 'string',
    required: false,
  },
  isFinished: {
    type: 'boolean',
    required: false
  },
  startTime: {
    type: 'dateTime',
    required: false
  },
  finishedTime: {
    type: 'dateTime',
    required: false
  },
  principalIds: {
    type: 'array',
    required: false,
    itemType: 'number'
  },
  reminderTime: {
    type: 'dateTime',
    required: false
  }
}

const deletePlanRules = {
  id: {
    type: 'number',
    required: true,
  },
  taskId: {
    type: 'number',
    required: true,
  }
}

const createBranchRules = Object.assign({}, createPlanRules, {
  planId: {
    type: 'number',
    required: true
  }
})

const updateBranchRules = Object.assign({}, updatePlanRules, {
  planId: {
    type: 'number',
    required: true
  }
})

const deleteBranchRules = Object.assign({}, deletePlanRules, {
  planId: {
    type: 'number',
    required: true
  }
})

class TaskController extends Controller {
  get taskService () {
    return this.ctx.service.task
  }

  async index () {
    const { ctx } = this
    const params = ctx.filterParams(getAllRules, Object.assign({}, ctx.query))
    const tasks = await this.taskService.index(params)
    ctx.body = tasks
  }

  async get () {
    const { ctx } = this
    const params = ctx.filterParams(getRules, Object.assign({}, ctx.params))
    const task = await this.taskService.get(params)
    ctx.body = task
  }

  async create () {
    const { ctx } = this
    const params = ctx.filterParams(createRules, Object.assign({}, ctx.request.body))
    const task = await this.taskService.create(params)
    ctx.body = task
  }

  async update () {
    const { ctx } = this
    const params = ctx.filterParams(updateRules, Object.assign({}, ctx.params, ctx.request.body))
    const task = await this.taskService.update(params)
    ctx.body = task
  }

  async delete () {
    const { ctx } = this
    const params = ctx.filterParams(deleteRules, Object.assign({}, ctx.params))
    await this.taskService.delete(params)
  }

  async createTaskRate () {
    const { ctx } = this
    const params = ctx.filterParams(updateTaskRateRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.createTaskRate(params)
  }

  async createMemberRate () {
    const { ctx } = this
    const params = ctx.filterParams(updateMemberRateRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.createMemberRate(params)
  }

  async getMembers () {
    const { ctx } = this
    const params = ctx.filterParams(getMemberRules, Object.assign({}, ctx.params))
    const members = await this.taskService.getMembers(params)
    ctx.body = members
  }

  async createPlan () {
    const { ctx } = this
    const params = ctx.filterParams(createPlanRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.createPlan(params)
  }

  async updatePlan () {
    const { ctx } = this
    const params = ctx.filterParams(updatePlanRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.updatePlan(params)
  }

  async deletePlan () {
    const { ctx } = this
    const params = ctx.filterParams(deletePlanRules, Object.assign({}, ctx.params))
    await this.taskService.deletePlan(params)
  }

  async createBranch () {
    const { ctx } = this
    const params = ctx.filterParams(createBranchRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.createBranch(params)
  }

  async updateBranch () {
    const { ctx } = this
    const params = ctx.filterParams(updateBranchRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.updateBranch(params)
  }

  async deleteBranch () {
    const { ctx } = this
    const params = ctx.filterParams(deleteBranchRules, Object.assign({}, ctx.params, ctx.request.body))
    await this.taskService.deleteBranch(params)
  }
}

module.exports = TaskController
