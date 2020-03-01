'use strict'

const Controller = require('egg').Controller

const createRules = {
  name: {
    type: 'string',
    required: true
  },
  color: {
    type: 'string',
    required: true
  }
}

const updateRules = {
  id: {
    type: 'number',
    required: true
  },
  name: {
    type: 'string',
    required: false
  },
  color: {
    type: 'string',
    required: false
  }
}

const deleteRules = {
  id: {
    type: 'number',
    required: true
  }
}

class TaskTypeController extends Controller {
  get taskTypeService () {
    return this.ctx.service.taskType
  }

  async index () {
    const { ctx } = this
    const taskTypes = await this.taskTypeService.index()
    ctx.body = taskTypes
  }

  async create () {
    const { ctx } = this
    const params = ctx.filterParams(createRules, Object.assign({}, ctx.request.body))
    const taskType = await this.taskTypeService.create(params)
    ctx.body = taskType
  }

  async update () {
    const { ctx } = this
    const params = ctx.filterParams(updateRules, Object.assign({}, ctx.params, ctx.request.body))
    const taskType = await this.taskTypeService.update(params)
    ctx.body = taskType
  }

  async delete () {
    const { ctx } = this
    const params = ctx.filterParams(deleteRules, Object.assign({}, ctx.params))
    await this.taskTypeService.delete(params)
  }
}

module.exports = TaskTypeController
