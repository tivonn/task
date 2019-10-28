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
    const principalCount = -1
    const createCount = await this.taskModel.count({
      where: {
        creatorId: ctx.state.currentUser.id
      }
    })
    const ccCount = -1
    // todo unfished and delay
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
}

module.exports = StatisticsService
