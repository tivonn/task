'use strict'

const Controller = require('egg').Controller

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
    type: 'number',
    required: false
  },
  deadline: {
    type: 'dateTime',
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
    // todo deleteRules
    const params = Object.assign({}, ctx.params)
    await this.taskService.destroy(params)
  }
}

module.exports = TaskController
