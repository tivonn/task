'use strict'

const Service = require('egg').Service

const { TASK_STATUS } = require('../enum/task')

class StatisticsService extends Service {
  get taskModel () {
    return this.app.model.Task
  }

  async all () {
    const { ctx, app } = this
    const { Op } = app.Sequelize
    const unfinishedCount = await this.taskModel.count({
      // todo create or principal or cc
      where: {
        status: 'unfinished',
        creatorId: ctx.state.currentUser.id
      }
    })
    const principalCount = await this.taskModel.count({
      where: {
        status: 'unfinished'
      },
      include: {
        model: app.model.TaskPrincipal,
        as: 'principal',
        where: {
          principalId: ctx.state.currentUser.id
        }
      }
    })
    const createCount = await this.taskModel.count({
      where: {
        status: 'unfinished',
        creatorId: ctx.state.currentUser.id
      }
    })
    const ccCount = await this.taskModel.count({
      where: {
        status: 'unfinished'
      },
      include: {
        model: app.model.TaskCcer,
        as: 'ccer',
        where: {
          ccerId: ctx.state.currentUser.id
        }
      }
    })
    const delayCount = await this.taskModel.count({
      where: {
        status: 'unfinished',
        deadline: {
          [Op.lt]: new Date()
        },
        creatorId: ctx.state.currentUser.id
      }
    })
    const finishedCount = await this.taskModel.count({
      where: {
        status: 'finished',
        creatorId: ctx.state.currentUser.id
      }
    })
    const allStatistics = {
      unfinishedCount,
      principalCount,
      createCount,
      ccCount,
      delayCount,
      finishedCount
    }
    return allStatistics
  }

  async period () {
    // todo
    return []
  }
}

module.exports = StatisticsService
