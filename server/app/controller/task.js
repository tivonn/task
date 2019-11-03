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
  }
}

const getRules = getAllRules

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

  async show () {
    const { ctx } = this
    const params = ctx.filterParams(getRules, Object.assign({}, ctx.params))
    const task = await this.taskService.show(params)
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

  async destroy () {
    const { ctx } = this
    const params = ctx.filterParams(deleteRules, Object.assign({}, ctx.params))
    await this.taskService.destroy(params)
  }
}

module.exports = TaskController
