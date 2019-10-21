'use strict'

const Controller = require('egg').Controller

const getRules = {
  attributes: {
    exclude: ['createdAt', 'updatedAt']
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
  isCompleted: {
    type: 'boolean',
    required: false
  },
  deadline: {
    type: 'date',
    required: false
  },
  taskTypeId: {
    type: 'number',
    required: false
  },
  principalId: {
    type: 'number',
    required: false
  },
  ccerId: {
    type: 'number',
    required: false
  }
}

class TaskController extends Controller {
  get taskService () {
    return this.ctx.service.task
  }

  async index () {
    const { ctx } = this
    const params = Object.assign({}, getRules)
    const tasks = await this.taskService.index(params)
    ctx.body = tasks
  }

  async show () {
    const { ctx } = this
    const params = Object.assign({}, getRules, ctx.params)
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
    const ctx = this.ctx
    const params = ctx.filterParams(updateRules, Object.assign({}, ctx.params, ctx.request.body))
    const task = await this.taskService.update(params)
    ctx.body = task
  }

  async destroy () {
    const { ctx } = this
    const params = Object.assign({}, ctx.params)
    await this.taskService.destroy(params)
  }
}

module.exports = TaskController
